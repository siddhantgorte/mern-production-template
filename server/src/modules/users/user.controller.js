import * as userService from "./user.service.js"
import ApiResponse from "../../common/utils/api-respons.js"

const getMe = async (req, res) => {
    const user = await userService.getOrCreateUser(req.auth.userId)

    if (!user) {
        throw ApiError.notFound("User Not Found")
    }

    ApiResponse.ok(res, "User Profile", user)
}

export {
    getMe
}