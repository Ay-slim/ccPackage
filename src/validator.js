const joi = require ('joi')

const optionsSchema = joi.object({
    bank_code: joi.string(),
    starts_with: joi.string(),
    ends_with: joi.string(),
    contains: joi.string(),
    issuer: joi.string().valid('Verve', 'Visa', 'MasterCard')
})

module.exports = optionsSchema