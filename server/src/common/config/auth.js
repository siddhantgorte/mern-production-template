import { betterAuth } from "better-auth"
import { mongodbAdapter } from "better-auth/adapters/mongodb"

import { getMongoDB } from "./db.js"
import { sendPasswordResetEmail, sendVerificationEmail, sendWelcomeEmail } from "../services/email.service.js"

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
                }
            },

            emailAndPassword: {
                enabled: true,
                requireEmailVerification: true,
                minPasswordLength: 8,
                sendResetPassword: async ({ user, url, token }) => {
                    const resetUrl = token
                        ? `${process.env.CLIENT_URL || "http://localhost:5173"}/reset-password?token=${token}`
                        : url

                    await sendPasswordResetEmail({
                        to: user.email,
                        name: user.name,
                        url: resetUrl
                    })
                }
            },

            emailVerification: {
                sendOnSignUp: true,
                autoSignInAfterVerification: false,
                sendVerificationEmail: async ({ user, url, token }) => {
                    const verificationUrl = token
                        ? `${process.env.CLIENT_URL || "http://localhost:5173"}/verify-email?token=${token}`
                        : url

                    await sendVerificationEmail({
                        to: user.email,
                        name: user.name,
                        url: verificationUrl
                    })
                }
            },


            account: {
                storeStateStrategy: "database",
                skipStateCookieCheck: true,
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

                     databaseHooks: {
             user: {
                 create: {
                     after: async (user) => {
                         sendWelcomeEmail({
                             to: user.email,
                             name: user.name
                         }).catch((err) => {
                             console.error("❌ Failed to send welcome email:", err)
                         })
                     }
                 }
             }
         },

        })
    }

    return auth
}

export default getAuth
