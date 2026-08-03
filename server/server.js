import http from "http"
import dotenv from "dotenv"

import app from "./src/app.js"
import connectDB from "./src/common/config/db.js"

dotenv.config()

const PORT = process.env.PORT || 3000

async function startServer() {
    
    try {
        await connectDB();
        
        const server = http.createServer(app)
        
        server.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`)
        })
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

startServer()
