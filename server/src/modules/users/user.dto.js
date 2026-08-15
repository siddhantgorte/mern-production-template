import Joi from "joi"
import BaseDto from "../../common/dto/base.dto.js"

class UpdateUserDto extends BaseDto {
    static schema = Joi.object({
        name: Joi.string()
            .trim()
            .min(2)
            .max(100)
    }).min(1)
}

export {
    UpdateUserDto
}
