const API_URL = import.meta.env.VITE_API_URL

const apiRequest = async (endpoint, options = {}) => {
    const isFormData = options.body instanceof FormData

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,

        credentials: "include",

        headers: {
            ...(isFormData
                ? {}
                : {
                    "Content-Type": "application/json"
                }),

            ...options.headers
        }
    })

    const data = await response.json().catch(() => null)

    if (!response.ok) {
        throw new Error(
            data?.message || "Something went wrong"
        )
    }

    return data
}

export default apiRequest
