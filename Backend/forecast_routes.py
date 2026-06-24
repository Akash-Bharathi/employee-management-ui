from fastapi import APIRouter, HTTPException
from typing import List
from schemas import ForecastDetailItem
from schemas import (
    ForecastSummaryResponse,
    CategoryForecastResponse,
    ProductForecastResponse,
)
from services.forecast_service import ForecastService

router = APIRouter(prefix="/api/forecasts", tags=["forecasts"])

forecast_service = ForecastService()


def _serialize_forecast_df(df):
    return [
        {
            "transaction_date": row["transaction_date"],
            "forecast_quantity": float(row["forecast_quantity"]),
        }
        for _, row in df.iterrows()
    ]


def _serialize_historical_df(df):
    return [
        {
            "transaction_date": row["transaction_date"],
            "quantity": float(row["quantity"]),
        }
        for _, row in df.iterrows()
    ]
def _serialize_comparison_df(df):
    return [
        {
            "transaction_date":
                row["transaction_date"],
            "historical":
                float(row["historical"]),
            "forecast":
                float(row["forecast"]),
        }
        for _, row in df.iterrows()
    ]

@router.get("/demand", response_model=ForecastSummaryResponse)


def get_forecast_demand():
    summary = forecast_service.get_dashboard_summary()
    forecast_df = forecast_service.get_total_forecast()
    historical_df = forecast_service.get_historical_demand()
    comparison_df = forecast_service.get_historical_vs_forecast()
    daily_total = forecast_service._aggregate_daily_demand(forecast_service.raw_data, [])
    confidence = forecast_service.get_confidence_score(daily_total)

    return {
        "historical_vs_forecast":_serialize_comparison_df( comparison_df),
        "total_quantity": summary["total_quantity"],
        "date_range": summary["date_range"],
        "unique_categories": summary["unique_categories"],
        "unique_products": summary["unique_products"],
        "top_categories": summary["top_categories"],
        "top_products": summary["top_products"],
        "forecast_totals": _serialize_forecast_df(forecast_df),
        "historical_demand": _serialize_historical_df(historical_df),
        "confidence_score": confidence,
    }


@router.get("/categories", response_model=List[str])
def get_forecast_categories():
    return forecast_service.get_categories()
@router.get("/category/{category}/comparison")
def get_category_comparison(category: str):

    categories = forecast_service.get_categories()

    if category not in categories:
        raise HTTPException(
            status_code=404,
            detail="Category not found"
        )

    comparison_df = (
        forecast_service
        .get_category_historical_vs_forecast(
            category
        )
    )

    return _serialize_comparison_df(
        comparison_df
    )   


@router.get("/products", response_model=List[str])
def get_forecast_products():
    return forecast_service.get_products()

@router.get("/product/{product}/comparison")
def get_product_comparison(product: str):

    products = forecast_service.get_products()

    if product not in products:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    comparison_df = (
        forecast_service
        .get_product_historical_vs_forecast(
            product
        )
    )

    return _serialize_comparison_df(
        comparison_df
    ) 

@router.get("/category/{category}", response_model=CategoryForecastResponse)
def get_forecast_category(category: str):
    categories = forecast_service.get_categories()
    if category not in categories:
        raise HTTPException(status_code=404, detail="Category not found")

    forecast_df = forecast_service.get_category_forecast(category)
    daily_category = forecast_service._aggregate_daily_demand(
        forecast_service.raw_data[forecast_service.raw_data["aisle"] == category],
        ["aisle"],
    )
    confidence = forecast_service.get_confidence_score(daily_category)

    return {
        "category": category,
        "forecast": _serialize_forecast_df(forecast_df),
        "confidence_score": confidence,
    }


@router.get("/product/{product}", response_model=ProductForecastResponse)
def get_forecast_product(product: str):
    products = forecast_service.get_products()
    if product not in products:
        raise HTTPException(status_code=404, detail="Product not found")

    forecast_df = forecast_service.get_product_forecast(product)
    daily_product = forecast_service._aggregate_daily_demand(
        forecast_service.raw_data[forecast_service.raw_data["product_name"] == product],
        ["product_name"],
    )
    confidence = forecast_service.get_confidence_score(daily_product)

    return {
        "product": product,
        "forecast": _serialize_forecast_df(forecast_df),
        "confidence_score": confidence,
    }

@router.get("/details", response_model=List[ForecastDetailItem])
def get_forecast_details():
    return forecast_service.get_forecast_details()

@router.get("/comparison")
def get_forecast_comparison(
    category: str = "ALL",
    product: str = "ALL"
):
    df = forecast_service.get_historical_vs_forecast(
        category=category,
        product=product
    )

    return [
        {
            "transaction_date": str(row["transaction_date"]),
            "historical": float(row["historical"]),
            "forecast": float(row["forecast"]),
        }
        for _, row in df.iterrows()
    ]