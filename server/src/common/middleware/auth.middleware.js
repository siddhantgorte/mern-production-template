import { fromNodeHeaders } from "better-auth/node"

import { getAuth } from "../config/auth.js"
import ApiError from "../utils/api-error.js"

const authMiddleware = async (req, res, next) => {
    try {
        const session = await getAuth().api.getSession({
            headers: fromNodeHeaders(req.headers),
        })

        if (!session) {
            throw ApiError.unauthorized("Unauthorized")
        }

        req.auth = session

        next()
    } catch (error) {
        next(error)
    }
}

export default authMiddleware
