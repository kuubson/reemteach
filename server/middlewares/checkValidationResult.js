import { validationResult } from 'express-validator'

export default (req, res, next) => {
    const validationResults = validationResult(req)
    if (!validationResults.isEmpty()) {
        const status = 422
        res.status(status).send({
            status,
            errorMessage: 'Sprawdź wprowadzane dane!',
            validationResults: validationResults.errors.map(error => {
                return {
                    parameter: error.param,
                    error: error.msg
                }
            })
        })
    } else {
        next()
    }
}
