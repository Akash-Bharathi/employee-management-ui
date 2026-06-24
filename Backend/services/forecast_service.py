import os

import pandas as pd


class ForecastService:
    def __init__(self, data_path: str | None = None):
        self.data_path = data_path or os.path.abspath(
            os.path.join(os.path.dirname(__file__), "..",
                         "data", "grocery_chain_data.csv")
        )
        self.raw_data = self._load_data()

    def _load_data(self) -> pd.DataFrame:
        df = pd.read_csv(self.data_path)
        if "transaction_date" not in df.columns:
            raise ValueError(
                "Expected transaction_date column in forecast data")

        df["transaction_date"] = pd.to_datetime(
            df["transaction_date"], errors="coerce")
        df = df.dropna(subset=["transaction_date"]).copy()

        df["day_of_week"] = df["transaction_date"].dt.dayofweek
        df["month"] = df["transaction_date"].dt.month
        df["week_of_year"] = df["transaction_date"].dt.isocalendar().week.astype(int)
        df["is_weekend"] = df["day_of_week"] >= 5
        df["promotion_flag"] = df.get("discount_amount", 0) > 0

        return df

    def get_categories(self) -> list[str]:
        return sorted(self.raw_data["aisle"].dropna().unique().tolist())

    def get_products(self) -> list[str]:
        return sorted(self.raw_data["product_name"].dropna().unique().tolist())

    def get_category_forecast(self, category: str) -> pd.DataFrame:
        return self._get_forecast_for_group("aisle", category)

    def get_product_forecast(self, product: str) -> pd.DataFrame:
        return self._get_forecast_for_group("product_name", product)

    def get_forecast_details(self) -> list[dict[str, object]]:
        forecast_rows = []
        for product_name, group_df in self.raw_data.groupby("product_name", dropna=False):
            if pd.isna(product_name):
                continue

            category = ""
            if "aisle" in group_df.columns and not group_df["aisle"].dropna().empty:
                category = group_df["aisle"].mode().iloc[0]

            daily = self._aggregate_daily_demand(group_df, ["product_name"])
            confidence = self.get_confidence_score(daily)
            forecast_df = self._forecast_next_days(daily)

            for _, row in forecast_df.iterrows():
                forecast_rows.append({
                    "date": row["transaction_date"].date().isoformat(),
                    "product_name": product_name,
                    "category": category,
                    "predicted_demand": float(row["forecast_quantity"]),
                    "confidence": confidence,
                })

        return forecast_rows

    def get_dashboard_summary(self) -> dict:
        if self.raw_data.empty:
            return {
                "total_quantity": 0,
                "date_range": {"start": "", "end": ""},
                "unique_categories": 0,
                "unique_products": 0,
                "top_categories": [],
                "top_products": [],
            }

        category_totals = (
            self.raw_data.groupby("aisle", as_index=False)["quantity"]
            .sum()
            .sort_values("quantity", ascending=False)
        )
        product_totals = (
            self.raw_data.groupby("product_name", as_index=False)["quantity"]
            .sum()
            .sort_values("quantity", ascending=False)
        )

        return {
            "total_quantity": int(self.raw_data["quantity"].sum()),
            "date_range": {
                "start": str(self.raw_data["transaction_date"].min().date()),
                "end": str(self.raw_data["transaction_date"].max().date()),
            },
            "unique_categories": int(self.raw_data["aisle"].nunique()),
            "unique_products": int(self.raw_data["product_name"].nunique()),
            "top_categories": category_totals.to_dict(orient="records"),
            "top_products": product_totals.head(10).to_dict(orient="records"),
        }

    def _get_forecast_for_group(self, group_col: str, group_value: str) -> pd.DataFrame:
        group_df = self.raw_data[self.raw_data[group_col]
                                 == group_value].copy()
        if group_df.empty:
            return pd.DataFrame(columns=["transaction_date", "forecast_quantity"])

        daily = self._aggregate_daily_demand(group_df, [group_col])
        forecast = self._forecast_next_days(daily)
        return forecast

    def _aggregate_daily_demand(self, df: pd.DataFrame, group_cols: list[str] | None = None) -> pd.DataFrame:
        group_cols = group_cols or []
        index_cols = group_cols + \
            ["transaction_date"] if group_cols else ["transaction_date"]

        grouped = (
            df.groupby(index_cols, as_index=False)["quantity"].sum()
            .sort_values(index_cols)
        )

        full_frames = []
        if group_cols:
            groups = grouped.groupby(group_cols, dropna=False)
        else:
            groups = [(None, grouped)]

        for keys, subset in groups:
            subset = subset.set_index("transaction_date").sort_index()
            full_index = pd.date_range(
                subset.index.min(), subset.index.max(), freq="D")
            subset = subset.reindex(full_index, fill_value=0)
            subset.index.name = "transaction_date"
            subset = subset.reset_index()

            if group_cols:
                if isinstance(keys, tuple):
                    for col, value in zip(group_cols, keys):
                        subset[col] = value
                else:
                    subset[group_cols[0]] = keys

            subset["previous_day_demand"] = subset["quantity"].shift(
                1).fillna(0)
            subset["rolling_7_day_avg"] = subset["quantity"].rolling(
                window=7, min_periods=1).mean()
            full_frames.append(subset)

        result = pd.concat(full_frames, ignore_index=True)
        return result

    def get_total_forecast(self, days: int = 30) -> pd.DataFrame:
        daily = self._aggregate_daily_demand(self.raw_data, [])
        return self._forecast_next_days(daily, days)

    def get_historical_demand(self) -> pd.DataFrame:
        historical = self._aggregate_daily_demand(self.raw_data, [])
        return historical[["transaction_date", "quantity"]].copy()

    def get_historical_vs_forecast(
        self,
        category: str = "ALL",
        product: str = "ALL"
    ) -> pd.DataFrame:

        df = self.raw_data.copy()

        if category != "ALL":
            df = df[df["aisle"] == category]

        if product != "ALL":
            df = df[df["product_name"] == product]

        daily = self._aggregate_daily_demand(
            df,
            []
        )

        if len(daily) < 4:
            return pd.DataFrame()

        rows = []

        quantities = daily["quantity"].tolist()

        for i in range(3, len(quantities)):

            last_three = quantities[i - 3:i]

            forecast = (
                last_three[2] * 0.5 +
                last_three[1] * 0.3 +
                last_three[0] * 0.2
            )

            rows.append({
                "transaction_date":
                    daily.iloc[i]["transaction_date"],
                "historical":
                    float(daily.iloc[i]["quantity"]),
                "forecast":
                    float(forecast),
            })

        return pd.DataFrame(rows)

    def get_category_historical_vs_forecast(
        self,
        category: str
    ) -> pd.DataFrame:

        category_df = self.raw_data[
            self.raw_data["aisle"] == category
        ]

        if category_df.empty:
            return pd.DataFrame()

        daily = self._aggregate_daily_demand(
            category_df,
            ["aisle"]
        )

        if len(daily) < 4:
            return pd.DataFrame()

        rows = []

        quantities = daily["quantity"].tolist()

        for i in range(3, len(quantities)):

            forecast = (
                quantities[i - 1] * 0.5 +
                quantities[i - 2] * 0.3 +
                quantities[i - 3] * 0.2
            )

            rows.append({
                "transaction_date":
                    daily.iloc[i]["transaction_date"],
                "historical":
                    float(daily.iloc[i]["quantity"]),
                "forecast":
                    float(forecast),
            })

        return pd.DataFrame(rows)

    def get_product_historical_vs_forecast(self, product: str) -> pd.DataFrame:

        product_df = self.raw_data[
            self.raw_data["product_name"] == product
        ]

        if product_df.empty:
            return pd.DataFrame()

        daily = self._aggregate_daily_demand(
            product_df,
            ["product_name"]
        )

        if len(daily) < 4:
            return pd.DataFrame()

        rows = []

        quantities = daily["quantity"].tolist()

        for i in range(3, len(quantities)):

            forecast = (
                quantities[i - 1] * 0.5 +
                quantities[i - 2] * 0.3 +
                quantities[i - 3] * 0.2
            )

            rows.append({
                "transaction_date":
                    daily.iloc[i]["transaction_date"],
                "historical":
                    float(daily.iloc[i]["quantity"]),
                "forecast":
                    float(forecast),
            })

        return pd.DataFrame(rows)

    def get_confidence_score(self, daily_df: pd.DataFrame) -> int:
        if daily_df.empty:
            return 0

        non_zero_ratio = (daily_df["quantity"] > 0).mean()
        return int(round(non_zero_ratio * 100))

    def _forecast_next_days(self, daily_df: pd.DataFrame, days: int = 30) -> pd.DataFrame:
        if daily_df.empty:
            return pd.DataFrame(columns=["transaction_date", "forecast_quantity"])

        ordered = daily_df.sort_values(
            "transaction_date").reset_index(drop=True)
        history = ordered["quantity"].tolist()
        last_date = ordered["transaction_date"].iloc[-1]

        forecasted_values = []
        rolling = history.copy()
        weights = [0.5, 0.3, 0.2]

        for day in range(1, days + 1):
            input_values = rolling[-3:]
            normalized_weights = weights[-len(input_values):]
            normalized_weights = [w / sum(normalized_weights)
                                  for w in normalized_weights]
            predicted = sum(value * weight for value,
                            weight in zip(input_values[::-1], normalized_weights))
            forecasted_values.append(predicted)
            rolling.append(predicted)

        forecast_dates = pd.date_range(
            last_date + pd.Timedelta(days=1), periods=days, freq="D")
        return pd.DataFrame({"transaction_date": forecast_dates, "forecast_quantity": forecasted_values})
