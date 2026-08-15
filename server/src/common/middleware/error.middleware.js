const errorMiddleware = (err, req, res, next) => {
    console.error(err)

    const statusCode = err.statusCode || 500

    const message =
        err.isOperational || process.env.NODE_ENV !== "production"
            ? err.message
            : "Internal Server Error"

    return res.status(statusCode).json({
        success: false,
        message,
        requestId: req.requestId
    })
}

export default errorMiddleware
