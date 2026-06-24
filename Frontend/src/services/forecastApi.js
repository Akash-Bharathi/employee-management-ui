const FORECAST_API_URL =
    "http://127.0.0.1:8000/api/forecasts";

export const getForecastSummary =
    async () => {

        const response =
            await fetch(
                `${FORECAST_API_URL}/demand`
            );

        if (!response.ok) {
            throw new Error(
                "Failed to fetch forecast summary"
            );
        }

        return await response.json();
    };

export const getCategories =
    async () => {

        const response =
            await fetch(
                `${FORECAST_API_URL}/categories`
            );

        if (!response.ok) {
            throw new Error(
                "Failed to fetch categories"
            );
        }

        return await response.json();
    };

export const getProducts =
    async () => {

        const response =
            await fetch(
                `${FORECAST_API_URL}/products`
            );

        if (!response.ok) {
            throw new Error(
                "Failed to fetch products"
            );
        }

        return await response.json();
    };

export const getCategoryForecast =
    async (category) => {

        const response =
            await fetch(
                `${FORECAST_API_URL}/category/${encodeURIComponent(category)}`
            );

        if (!response.ok) {
            throw new Error(
                "Failed to fetch category forecast"
            );
        }

        return await response.json();
    };

export const getProductForecast =
    async (product) => {

        const response =
            await fetch(
                `${FORECAST_API_URL}/product/${encodeURIComponent(product)}`
            );

        if (!response.ok) {
            throw new Error(
                "Failed to fetch product forecast"
            );
        }

        return await response.json();
    };
