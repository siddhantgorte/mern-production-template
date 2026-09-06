import Joi from "joi"

const envSchema = Joi.object({
    PORT: Joi.number().default(5000),
    NODE_ENV: Joi.string()
        .valid("development", "production", "test")
        .default("development"),
    MONGODB_URI: Joi.string().required().messages({
        "any.required": "MONGODB_URI is required in environment variables."
    }),
    RATE_LIMIT_WINDOW_MS: Joi.number().default(900000),
    RATE_LIMIT_MAX: Joi.number().default(100),
    BETTER_AUTH_SECRET: Joi.string().required().messages({
        "any.required": "BETTER_AUTH_SECRET is required in environment variables."
    }),
    BETTER_AUTH_URL: Joi.string().uri().required().messages({
        "any.required": "BETTER_AUTH_URL is required (must be a valid URL without trailing slash)."
    }),
    CLIENT_URL: Joi.string().uri().required().messages({
        "any.required": "CLIENT_URL is required (must be a valid URL without trailing slash)."
    }),
    GOOGLE_CLIENT_ID: Joi.string().required().messages({
        "any.required": "GOOGLE_CLIENT_ID is required for Google OAuth."
    }),
    GOOGLE_CLIENT_SECRET: Joi.string().required().messages({
        "any.required": "GOOGLE_CLIENT_SECRET is required for Google OAuth."
    })
}).unknown(true) // Allows other system/OS environment variables to be present without failing.

export const validateEnv = () => {
    const { error } = envSchema.validate(process.env, { abortEarly: false })
    if (error) {
        console.error("\n❌ FATAL: Environment variable validation failed:")
        error.details.forEach((detail) => {
            console.error(`   👉 ${detail.message}`)
        })
        console.error("\nPlease check your server/.env file or hosting environment variables.\n")
        process.exit(1)
    }
}
export default validateEnv