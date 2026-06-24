from datetime import datetime

from pydantic import (
    BaseModel,
    EmailStr,
    field_validator,
)


class SignupRequest(BaseModel):
    fullname: str
    email: EmailStr
    company: str
    role: str
    password: str

    @field_validator("fullname")
    @classmethod
    def validate_fullname(cls, value):
        value = value.strip()

        if len(value) < 2:
            raise ValueError(
                "Full name must be at least 2 characters"
            )

        return value

    @field_validator("company")
    @classmethod
    def validate_company(cls, value):
        allowed_companies = [
            "Company A",
            "Company B",
            "Company C",
        ]

        if value not in allowed_companies:
            raise ValueError(
                "Invalid company selected"
            )

        return value

    @field_validator("role")
    @classmethod
    def validate_role(cls, value):
        allowed_roles = [
            "admin",
            "user",
        ]

        if value not in allowed_roles:
            raise ValueError(
                "Invalid role selected"
            )

        return value

    @field_validator("password")
    @classmethod
    def validate_password(cls, value):
        if len(value) < 8:
            raise ValueError(
                "Password must be at least 8 characters"
            )

        return value


class LoginRequest(BaseModel):
    email: EmailStr
    password: str

    @field_validator("password")
    @classmethod
    def validate_password(cls, value):
        if not value.strip():
            raise ValueError(
                "Password is required"
            )

        return value


class UserResponse(BaseModel):
    id: int
    fullname: str
    email: str
    company: str
    role: str
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


class LoginResponse(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse


class SecurityEventResponse(BaseModel):
    id: int
    user_email: str
    company: str | None = None
    event_type: str
    description: str
    risk_points: int
    severity: str
    status: str
    created_at: datetime

    class Config:
        from_attributes = True


class SecuritySummaryResponse(BaseModel):
    alerts_today: int
    open_alerts: int
    resolved_alerts: int
    critical_alerts: int


class RiskUserResponse(BaseModel):
    user_email: str
    company: str | None = None
    risk_score: int
    risk_level: str


class RiskCompanyResponse(BaseModel):
    company: str
    risk_score: int
    user_count: int
    risk_level: str


class DateRange(BaseModel):
    start: str
    end: str


class ForecastItem(BaseModel):
    transaction_date: datetime
    forecast_quantity: float

    class Config:
        from_attributes = True


class HistoricalDemandItem(BaseModel):
    transaction_date: datetime
    quantity: float

    class Config:
        from_attributes = True


class TopCategoryItem(BaseModel):
    aisle: str
    quantity: float

    class Config:
        from_attributes = True


class TopProductItem(BaseModel):
    product_name: str
    quantity: float

    class Config:
        from_attributes = True


class HistoricalVsForecastItem(BaseModel):
    transaction_date: datetime
    historical: float
    forecast: float


class ForecastSummaryResponse(BaseModel):
    total_quantity: int
    date_range: DateRange
    unique_categories: int
    unique_products: int
    top_categories: list[TopCategoryItem]
    top_products: list[TopProductItem]
    forecast_totals: list[ForecastItem]
    historical_demand: list[HistoricalDemandItem]
    confidence_score: int
    historical_vs_forecast: list[HistoricalVsForecastItem]


class CategoryForecastResponse(BaseModel):
    category: str
    forecast: list[ForecastItem]
    confidence_score: int


class ProductForecastResponse(BaseModel):
    product: str
    forecast: list[ForecastItem]
    confidence_score: int
    
class ForecastDetailItem(BaseModel):
    date: str
    product_name: str
    category: str
    predicted_demand: float
    confidence: int