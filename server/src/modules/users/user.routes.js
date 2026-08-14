import Router from "express"
import * as userController from "./user.controller.js"
import authMiddleware from "../../common/middleware/auth.middleware.js"

const router = Router()

router.get("/me", authMiddleware, userController.getMe)

export default router
