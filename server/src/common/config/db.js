import mongoose from "mongoose"
import { MongoClient } from "mongodb"

let mongoClient

const connectDB = async () => {

    try {
        const connection = await mongoose.connect(process.env.MONGODB_URI)
        
        mongoClient = new MongoClient(process.env.MONGODB_URI)
        await mongoClient.connect()

        console.log(`✅ MongoDB Connected: ${connection.connection.host}`)
    } catch ( error ) {
        console.error("❌ MongoDB Connection Failed");
        console.error(error.message);
        process.exit(1);
    }
    
}

const getMongoDB = () => {
    if (!mongoClient) {
        throw new Error("MongoDB client is not connected")
    }

    return mongoClient.db()
}

export { getMongoDB }
export default connectDB
