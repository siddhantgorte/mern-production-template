const API_URL = import.meta.env.VITE_API_URL

const request = async (endpoint, options = {}) => {
    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            ...options.headers
        }
    })

    const data = await response.json()

    if (!response.ok) {
        throw new Error(data.message || "Something went wrong")
    }

    return data
}

const api = {
    get: (endpoint, options = {}) =>
        request(endpoint, {
            ...options,
            method: "GET"
        }),

    post: (endpoint, body, options = {}) =>
        request(endpoint, {
            ...options,
            method: "POST",
            body: JSON.stringify(body)
        }),

    patch: (endpoint, body, options = {}) =>
        request(endpoint, {
            ...options,
            method: "PATCH",
            body: JSON.stringify(body)
        }),

    put: (endpoint, body, options = {}) =>
        request(endpoint, {
            ...options,
            method: "PUT",
            body: JSON.stringify(body)
        }),

    delete: (endpoint, options = {}) =>
        request(endpoint, {
            ...options,
            method: "DELETE"
        })
}

export default api
