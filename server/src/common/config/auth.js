import { betterAuth } from "better-auth"
import { mongodbAdapter } from "better-auth/adapters/mongodb"

import { getMongoDB } from "./db.js"

let auth

const getAuth = () => {
    if (!auth) {
        auth = betterAuth({
            database: mongodbAdapter(getMongoDB()),

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
