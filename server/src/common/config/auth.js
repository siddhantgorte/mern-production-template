import { betterAuth } from "better-auth"
import { mongodbAdapter } from "better-auth/adapters/mongodb"

import { getMongoDB } from "./db.js"

let auth

const getAuth = () => {
    if (!auth) {
        auth = betterAuth({
            database: mongodbAdapter(getMongoDB()),

            baseURL: process.env.BETTER_AUTH_URL,
            secret: process.env.BETTER_AUTH_SECRET,
            
            trustedOrigins: [
                process.env.CLIENT_URL
            ],
            
            emailAndPassword: {
                enabled: true
            }
        })
    }

    return auth
}

export default getAuth
