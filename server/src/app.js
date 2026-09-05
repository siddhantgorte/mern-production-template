import express from "express"
import cors from "cors"
import helmet from "helmet"
import rateLimit from "express-rate-limit"
import morgan from "morgan"
import crypto from "node:crypto"

import { toNodeHandler } from "better-auth/node"

import { getAuth } from "./common/config/auth.js"
import errorMiddleware from "./common/middleware/error.middleware.js"

import userRoutes from "./modules/users/user.routes.js"

const app = express()

// Trust Render reverse proxy for secure cookies and correct protocol handling
app.set("trust proxy", 1)

// Middlewares

app.use(
    cors({
        origin: [
            "http://localhost:5173",
            process.env.CLIENT_URL
        ].filter(Boolean),
        credentials: true
    })
)

app.use(helmet())

app.use(
    rateLimit({
        windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
        max: Number(process.env.RATE_LIMIT_MAX) || 100,
        standardHeaders: true,
        legacyHeaders: false
    })
)

app.use((req, res, next) => {
    req.id = crypto.randomUUID()
    res.setHeader("X-Request-ID", req.id)

    next()
})

app.use(morgan("combined"))

// Better Auth

app.all(
    "/api/auth/*splat",
    (req, res, next) => {
        toNodeHandler(getAuth())(req, res, next)
    }
)

// Body Parsers

app.use(express.json({ limit: "1mb" }))

app.use(
    express.urlencoded({
        extended: true,
        limit: "1mb"
    })
)

// Root & Health Check

app.get("/", (_req, res) => {
    res.status(200).json({
        success: true,
        message: "MERN Production Backend API is running."
    })
})

app.get("/health", (_req, res) => {
    res.status(200).json({
        success: true,
        message: "Server is running..."
    })
})

// Routes

app.use("/api/users", userRoutes)

// 404 Handler

app.use((_req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found"
    })
})

// Error Handling

app.use(errorMiddleware)

export default app
