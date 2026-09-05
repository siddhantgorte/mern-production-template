import userService from "./user.service.js"
import ApiResponse from "../../common/utils/api-response.js"

const getCurrentUser = async (req, res, next) => {
    try {
        const user = await userService.getCurrentUser(req.auth)

        return ApiResponse.ok(res, "Authenticated user", user)
    } catch (error) {
        next(error)
    }
}

export default {
    getCurrentUser
}
