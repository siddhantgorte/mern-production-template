import Router from "express"
import * as templateController from "./_template.controller.js"

const router = Router()

router.get("/", templateController.getTemplate)

export default router