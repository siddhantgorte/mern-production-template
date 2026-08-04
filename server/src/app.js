import express from "express"
import cors from "cors"
import clerkConfig from "./common/config/clerk.js"

import userRoutes from "./modules/users/user.routes.js"

const app = express()

// Middlewares
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}))

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use(clerkConfig)

app.use("/api/users", userRoutes)

app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running...",
  });
});

export default app