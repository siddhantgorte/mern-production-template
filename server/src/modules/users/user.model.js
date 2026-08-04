import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    clerkId: {
        type: string,
        required: true,
        unique: true,
        index: true
    },
    name: {
        type: string,
        required: true,
        trim: true,
    },
    email: {
        type: string,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    }
}, { timestamps: true })

const user = mongoose.model("User", userSchema)

export default User