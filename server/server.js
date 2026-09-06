import "dotenv/config"
import http from "http"
import mongoose from "mongoose"

import app from "./src/app.js"
import connectDB from "./src/common/config/db.js"

import validateEnv from "./src/common/config/env.js"

const PORT = process.env.PORT || 3000

async function startServer() {
    
    try {
        // Validate environment variables before starting
        validateEnv()

        await connectDB();
        
        const server = http.createServer(app)
        
        server.listen(PORT, "0.0.0.0", () => {
            console.log(`Server running on http://localhost:${PORT}`)
        })

        // Graceful shutdown handler
        const handleShutdown = async (signal) => {
            console.log(`\n⚠️  ${signal} received. Starting graceful shutdown...`)
            // 1. Stop receiving new HTTP connections
            server.close(async () => {
                console.log("🔒 HTTP server closed.")
                try {
                    // 2. Cleanly close MongoDB connection pool
                    await mongoose.connection.close(false)
                    console.log("🛑 MongoDB connection closed cleanly.")
                    process.exit(0)
                } catch (err) {
                    console.error("❌ Error during MongoDB disconnection:", err)
                    process.exit(1)
                }
            })
            // 3. Fallback timeout: force exit if cleanup takes longer than 10 seconds
            setTimeout(() => {
                console.error("⏰ Forced shutdown: Timeout exceeded (10s).")
                process.exit(1)
            }, 10000).unref()
        }

         // Listen for OS termination signals
        process.on("SIGTERM", () => handleShutdown("SIGTERM"))
        process.on("SIGINT", () => handleShutdown("SIGINT"))

    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}


// Global safety listeners for uncaught errors
process.on("unhandledRejection", (reason) => {
    console.error("❌ Unhandled Promise Rejection:", reason)
})
process.on("uncaughtException", (error) => {
    console.error("❌ Uncaught Exception:", error)
    process.exit(1)
})

startServer()
