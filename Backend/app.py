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

import models


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
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    if not verify_password(
        payload.password,
        user.password_hash
    ):
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