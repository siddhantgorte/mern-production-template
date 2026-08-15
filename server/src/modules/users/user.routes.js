import Router from "express"
import * as userController from "./user.controller.js"
import authMiddleware from "../../common/middleware/auth.middleware.js"
import validate from "../../common/middleware/validate.middleware.js"
import { UpdateUserDto } from "./user.dto.js"

const router = Router()

router.get("/me", authMiddleware, userController.getMe)

router.patch("/me", authMiddleware, validate(UpdateUserDto), userController.updateMe)

export default router
