const API_URL =
    "http://127.0.0.1:8000";

export const getSecuritySummary =
    async () => {

        const response =
            await fetch(
                `${API_URL}/security/summary`
            );

        if (!response.ok) {
            throw new Error(
                "Failed to fetch summary"
            );
        }

        return await response.json();
    };
export const logUnauthorizedAccess =
    async (
        email,
        company,
        page
    ) => {

        await fetch(
            `${API_URL}/security/unauthorized-access`,
            {
                method: "POST",
                headers: {
                    "Content-Type":
                        "application/json"
                },
                body: JSON.stringify({
                    email,
                    company,
                    page
                })
            }
        );
    };
export const getTopRiskUsers =
    async () => {

        const response =
            await fetch(
                `${API_URL}/security/risk-users`
            );

        if (!response.ok) {
            throw new Error(
                "Failed to fetch risk users"
            );
        }

        return await response.json();
    };

export const getTopRiskCompanies =
    async () => {

        const response =
            await fetch(
                `${API_URL}/security/risk-companies`
            );

        if (!response.ok) {
            throw new Error(
                "Failed to fetch risk companies"
            );
        }

        return await response.json();
    };



export const getRecentSecurityEvents =
    async () => {

        const response =
            await fetch(
                `${API_URL}/security/events`
            );

        if (!response.ok) {
            throw new Error(
                "Failed to fetch security events"
            );
        }

        return await response.json();
    };

