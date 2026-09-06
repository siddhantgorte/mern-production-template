import "dotenv/config"
import http from "http"

import app from "./src/app.js"
import connectDB from "./src/common/config/db.js"

const PORT = process.env.PORT || 3000

async function startServer() {
    
    try {
        await connectDB();
        
        const server = http.createServer(app)
        
        server.listen(PORT, "0.0.0.0", () => {
            console.log(`Server running on http://localhost:${PORT}`)
        })
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

startServer()
