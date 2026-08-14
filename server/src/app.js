import express from "express"
import cors from "cors"
import { toNodeHandler } from "better-auth/node"

import getAuth from "./common/config/auth.js"
import userRoutes from "./modules/users/user.routes.js"
import errorMiddleware from "./common/middleware/error.middleware.js"

const app = express()

// Middlewares
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}))

// Better Auth
app.all("/api/auth/*splat", (req, res) => {
    return toNodeHandler(getAuth())(req, res)
})

// Body parsers
app.use(express.json())
app.use(express.urlencoded({extended: true}))

// Routes
app.use("/api/users", userRoutes)

app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running...",
  });
});

app.use(errorMiddleware)

export default app
