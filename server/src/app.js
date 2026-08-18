import express from "express"
import cors from "cors"
import { toNodeHandler } from "better-auth/node"

import getAuth from "./common/config/auth.js"
import userRoutes from "./modules/users/user.routes.js"
import errorMiddleware from "./common/middleware/error.middleware.js"
import helmet from "helmet"
import apiRateLimiter from "./common/middleware/rate-limit.middleware.js"
import logger from "./common/middleware/logger.middleware.js"
import requestIdMiddleware from "./common/middleware/request-id.middleware.js"
import notFoundMiddleware from "./common/middleware/not-found.middleware.js"

const app = express()

// Middlewares

app.use(requestIdMiddleware)

app.use(logger)

app.use(helmet())

const allowedOrigins = [
    "http://localhost:5173",
    process.env.CLIENT_URL
].filter(Boolean)

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true)
        } else {
            callback(new Error("Not allowed by CORS"))
        }
    },
    credentials: true
}))

app.use(apiRateLimiter)

// Better Auth
app.all("/api/auth/*splat", (req, res) => {
    return toNodeHandler(getAuth())(req, res)
})

// Body parsers
app.use(express.json({
    limit: "1mb"
}))

app.use(express.urlencoded({
    extended: true,
    limit: "1mb"
}))

// Routes
app.use("/api/users", userRoutes)

app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running...",
  });
});

app.use(notFoundMiddleware)

app.use(errorMiddleware)

export default app
