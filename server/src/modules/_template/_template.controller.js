import * as templateService from "./_template.service.js"
import ApiResponse from "../../common/utils/api-response.js"

const getTemplate = async (req, res) => {
    const data = await templateService.getTemplate()

    ApiResponse.ok(res, "Template data", data)
}

export {
    getTemplate
}