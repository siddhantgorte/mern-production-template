import express from "express"

import authMiddleware from "../../common/middleware/auth.middleware.js"
import userController from "./user.controller.js"

const router = express.Router()

router.get(
    "/me",
    authMiddleware,
    userController.getCurrentUser
)

export default router
