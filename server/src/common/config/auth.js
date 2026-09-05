import { betterAuth } from "better-auth"
import { mongodbAdapter } from "better-auth/adapters/mongodb"

import { getMongoDB } from "./db.js"

let auth

export const getAuth = () => {
    if (!auth) {
        auth = betterAuth({
            database: mongodbAdapter(getMongoDB()),

            baseURL: process.env.BETTER_AUTH_URL,

            secret: process.env.BETTER_AUTH_SECRET,

            trustedOrigins: [
                "http://localhost:5173",
                process.env.CLIENT_URL,
            ].filter(Boolean),

            advanced: {
                useSecureCookies: process.env.NODE_ENV === "production",
                defaultCookieAttributes: {
                    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
                    secure: process.env.NODE_ENV === "production",
                    partitioned: true
                }
            },

            account: {
                accountLinking: {
                    enabled: true,
                    trustedProviders: ["google"],
                },
            },

            socialProviders: {
                google: {
                    clientId: process.env.GOOGLE_CLIENT_ID,
                    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                },
            },
        })
    }

    return auth
}

export default getAuth
