# Demand Forecasting Dashboard

## Features

### Product Forecast Analysis

* Horizontal bar chart for forecasted product demand
* Product-level forecast comparison
* Dynamic updates when filters are applied


## Filtering

Two global filters are available:

### Category Filter

* All Categories
* Individual category selection

### Product Filter

* All Products
* Individual product selection

Filters dynamically update:

* KPI cards
* Demand trends chart
* Category chart
* Product forecast chart
* Forecast details table

---

## Forecasting Logic

Current forecasting uses a weighted moving average model.

Weights:

* Most recent day → 50%
* Previous day → 30%
* Third previous day → 20%

Formula:

Forecast = (D-1 × 0.5) + (D-2 × 0.3) + (D-3 × 0.2)

The same forecasting engine powers:

* Product forecasts
* Category forecasts
* Overall demand forecasts

---

## Backend

### Forecast Endpoints

* GET /api/forecasts/demand
* GET /api/forecasts/categories
* GET /api/forecasts/products
* GET /api/forecasts/category/{category}
* GET /api/forecasts/product/{product}
* GET /api/forecasts/details
* GET /api/forecasts/comparison

---

## Frontend

### Visual Components

* Interactive time-series forecasting chart
* Doughnut category chart
* Horizontal forecast demand chart
* Forecast details table
* Pagination controls
* Export action button


Implemented:

* Forecast dashboard
* Interactive charts
* Dynamic filtering
* Forecast details table
* Pagination
* Product and category forecasting
<img width="1920" height="1877" alt="Screenshot 2026-06-24 at 19-44-18 employee-management" src="https://github.com/user-attachments/assets/3b15121d-595d-455a-876a-1cbd3a171b89" />
<img width="1920" height="913" alt="Screenshot 2026-06-24 at 19-45-28 Employee Management API - Swagger UI" src="https://github.com/user-attachments/assets/b7dfe475-9656-4288-9dda-b677f0ccb3b2" />
<img width="1920" height="1877" alt="Screenshot 2026-06-24 at 19-44-48 employee-management" src="https://github.com/user-attachments/assets/39e7a34b-195a-4668-bcb1-25d31ec06ad7" />

