from fastapi import FastAPI
from fastapi import Depends
from fastapi import HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from sqlalchemy.orm import Session
from database import Base
from database import engine
from database import get_db
from schemas import LoginRequest
from schemas import LoginResponse
from auth import verify_password
from auth import create_access_token
from models import User
from schemas import SignupRequest
from schemas import UserResponse
from typing import Optional
from auth import hash_password
from models import User
from models import SecurityEvent
from schemas import SecurityEventResponse
from schemas import RiskUserResponse
from schemas import RiskCompanyResponse
from schemas import SecuritySummaryResponse

import models

def calculate_risk_level(score: int):

    if score >= 60:
        return "HIGH"

    if score >= 30:
        return "MEDIUM"

    return "LOW"
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Employee Management API"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {
        "message": "Employee Management API Running"
    }


@app.post(
    "/auth/signup",
    response_model=UserResponse
)
def signup(
    payload: SignupRequest,
    db: Session = Depends(get_db)
):
    existing_user = (
        db.query(User)
        .filter(User.email == payload.email)
        .first()
    )

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    new_user = User(
        fullname=payload.fullname,
        email=payload.email,
        company=payload.company,
        role=payload.role,
        password_hash=hash_password(
            payload.password
        )
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


@app.post(
    "/auth/login",
    response_model=LoginResponse
)
def login(
    payload: LoginRequest,
    db: Session = Depends(get_db)
):
    user = (
        db.query(User)
        .filter(User.email == payload.email)
        .first()
    )

    if not user:

        failed_event = SecurityEvent(
            user_email=payload.email,
            company=None,
            event_type="FAILED_LOGIN",
            description="Failed login attempt - user not found",
            risk_points=5,
            severity="HIGH"
        )

        db.add(failed_event)
        db.commit()

        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    if not verify_password(
        payload.password,
        user.password_hash
    ):

        failed_event = SecurityEvent(
            user_email=user.email,
            company=user.company,
            event_type="FAILED_LOGIN",
            description="Failed login attempt - incorrect password",
            risk_points=5,
            severity="HIGH"
        )

        db.add(failed_event)
        db.commit()

        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    if not user.is_active:
        raise HTTPException(
            status_code=403,
            detail="Account deactivated"
        )

    access_token = create_access_token(
        {
            "sub": user.email,
            "role": user.role
        }
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }


@app.get(
    "/members",
    response_model=List[UserResponse]
)
def get_members(
    company: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(User)

    if company:
        query = query.filter(
            User.company == company
        )

    return (
        query
        .order_by(User.id.desc())
        .all()
    )


@app.put("/members/{user_id}/deactivate")
def deactivate_member(
    user_id: int,
    db: Session = Depends(get_db)
):
    user = (
        db.query(User)
        .filter(User.id == user_id)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    user.is_active = False

    db.commit()

    return {
        "message": "User deactivated"
    }


@app.put("/members/{user_id}/activate")
def activate_member(
    user_id: int,
    db: Session = Depends(get_db)
):
    user = (
        db.query(User)
        .filter(User.id == user_id)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    user.is_active = True

    db.commit()

    return {
        "message": "User activated"
    }
@app.get(
    "/security/events",
    response_model=List[SecurityEventResponse]
)
def get_security_events(
    db: Session = Depends(get_db)
):

    events = (
        db.query(SecurityEvent)
        .order_by(
            SecurityEvent.created_at.desc()
        )
        .limit(20)
        .all()
    )

    return events
@app.get(
    "/security/risk-users",
    response_model=List[RiskUserResponse]
)
def get_risk_users(
    db: Session = Depends(get_db)
):

    events = db.query(
        SecurityEvent
    ).all()

    user_scores = {}

    for event in events:

        email = event.user_email

        if email not in user_scores:
            user_scores[email] = {
                "company":
                    event.company,
                "score": 0
            }

        user_scores[email][
            "score"
        ] += event.risk_points

    results = []

    for email, data in user_scores.items():

        score = data["score"]

        results.append(
            {
                "user_email":
                    email,
                "company":
                    data["company"],
                "risk_score":
                    score,
                "risk_level":
                    calculate_risk_level(
                        score
                    )
            }
        )

    results.sort(
        key=lambda x:
        x["risk_score"],
        reverse=True
    )

    return results[:10]

@app.get(
    "/security/risk-companies",
    response_model=List[
        RiskCompanyResponse
    ]
)
def get_risk_companies(
    db: Session = Depends(get_db)
):

    events = db.query(
        SecurityEvent
    ).all()

    companies = {}

    for event in events:

        company = (
            event.company
            or "Unknown"
        )

        if company not in companies:

            companies[company] = {
                "risk_score": 0,
                "users": set()
            }

        companies[company][
            "risk_score"
        ] += event.risk_points

        companies[company][
            "users"
        ].add(
            event.user_email
        )

    results = []

    for company, data in (
        companies.items()
    ):

        score = data[
            "risk_score"
        ]

        results.append(
            {
                "company":
                    company,
                "risk_score":
                    score,
                "user_count":
                    len(
                        data["users"]
                    ),
                "risk_level":
                    calculate_risk_level(
                        score
                    )
            }
        )

    results.sort(
        key=lambda x:
        x["risk_score"],
        reverse=True
    )

    return results[:10]

@app.get(
    "/security/summary",
    response_model=
    SecuritySummaryResponse
)
def get_security_summary(
    db: Session = Depends(get_db)
):

    alerts = db.query(
        SecurityEvent
    ).count()

    critical = (
        db.query(
            SecurityEvent
        )
        .filter(
            SecurityEvent.severity
            == "HIGH"
        )
        .count()
    )

    return {
        "alerts_today":
            alerts,
        "open_alerts":
            critical,
        "resolved_alerts":
            0,
        "critical_alerts":
            critical
    }
@app.post("/security/unauthorized-access")
def log_unauthorized_access(
    payload: dict,
    db: Session = Depends(get_db)
):

    event = SecurityEvent(
        user_email=payload.get("email"),
        company=payload.get("company"),
        event_type="UNAUTHORIZED_ACCESS",
        description=f"Unauthorized access attempt to {payload.get('page')}",
        risk_points=15,
        severity="HIGH"
    )

    db.add(event)
    db.commit()

    return {
        "message": "Unauthorized access logged"
    }
@app.get("/security/summary")
def get_security_summary(
    db: Session = Depends(get_db)
):

    total_alerts = (
        db.query(SecurityEvent)
        .count()
    )

    critical_alerts = (
        db.query(SecurityEvent)
        .filter(
            SecurityEvent.severity == "HIGH"
        )
        .count()
    )

    return {
        "alertsToday": total_alerts,
        "openAlerts": total_alerts,
        "resolvedAlerts": 0,
        "criticalAlerts": critical_alerts
    }