import ApiError from "../utils/api-error.js"

const notFoundMiddleware = (req, res, next) => {
    next(
        ApiError.notFound(
            `Route ${req.method} ${req.originalUrl} not found`
        )
    )
}

export default notFoundMiddleware
