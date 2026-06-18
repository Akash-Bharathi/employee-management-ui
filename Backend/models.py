from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import Boolean
from sqlalchemy import DateTime

from datetime import datetime

from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    fullname = Column(
        String,
        nullable=False
    )

    email = Column(
        String,
        unique=True,
        nullable=False
    )

    company = Column(
        String,
        nullable=False
    )

    role = Column(
        String,
        nullable=False
    )

    password_hash = Column(
        String,
        nullable=False
    )

    is_active = Column(
        Boolean,
        default=True
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )
class SecurityEvent(Base):
    __tablename__ = "security_events"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    user_email = Column(
        String,
        nullable=False
    )

    company = Column(
        String,
        nullable=True
    )

    event_type = Column(
        String,
        nullable=False
    )

    description = Column(
        String,
        nullable=False
    )

    risk_points = Column(
        Integer,
        default=0
    )

    severity = Column(
        String,
        nullable=False
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )