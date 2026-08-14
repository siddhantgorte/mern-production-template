import * as userService from "./user.service.js"
import ApiResponse from "../../common/utils/api-response.js"
import ApiError from "../../common/utils/api-error.js"

const getMe = async (req, res) => {
    const user = await userService.getOrCreateUser(req.auth.user)

    if (!user) {
        throw ApiError.notFound("User Not Found")
    }

    return ApiResponse.ok(res, "User Profile", user)
}

export {
    getMe
}
