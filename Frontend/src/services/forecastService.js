const BASE_URL =
    "http://localhost:8000/api/forecasts";

export const getDemandSummary =
    async (category = "ALL", product = "ALL") => {

        const params = new URLSearchParams();
        if (category) params.append("category", category);
        if (product) params.append("product", product);

        const response =
            await fetch(
                `${BASE_URL}/demand?${params.toString()}`
            );

        if (!response.ok) {
            throw new Error(
                "Failed to fetch demand summary"
            );
        }

        return await response.json();
    };

export const getCategories =
    async () => {

        const response =
            await fetch(
                `${BASE_URL}/categories`
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
                `${BASE_URL}/products`
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
                `${BASE_URL}/category/${encodeURIComponent(category)}`
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
                `${BASE_URL}/product/${encodeURIComponent(product)}`
            );

        if (!response.ok) {
            throw new Error(
                "Failed to fetch product forecast"
            );
        }

        return await response.json();
    };
export const getForecastDetails =
    async () => {

        const response =
            await fetch(
                `${BASE_URL}/details`
            );

        if (!response.ok) {
            throw new Error(
                "Failed to fetch forecast details"
            );
        }

        return await response.json();
    };

export const getForecastComparison =
    async (category = "ALL", product = "ALL") => {

        const params = new URLSearchParams();
        if (category) params.append("category", category);
        if (product) params.append("product", product);

        const response =
            await fetch(
                `${BASE_URL}/comparison?${params.toString()}`
            );

        if (!response.ok) {
            throw new Error(
                "Failed to fetch comparison data"
            );
        }

        return await response.json();
    };
export const getCategoryComparison =
    async (category) => {

        const response =
            await fetch(
                `${BASE_URL}/category/${encodeURIComponent(category)}/comparison`
            );

        if (!response.ok) {
            throw new Error(
                "Failed to fetch category comparison"
            );
        }

        return await response.json();
    };

export const getProductComparison =
    async (product) => {

        const response =
            await fetch(
                `${BASE_URL}/product/${encodeURIComponent(product)}/comparison`
            );

        if (!response.ok) {
            throw new Error(
                "Failed to fetch product comparison"
            );
        }

        return await response.json();
    };