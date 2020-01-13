import { validationResult } from 'express-validator'

export default (req, res, next) => {
    const validationResults = validationResult(req)
    if (!validationResults.isEmpty()) {
        const status = 422
        res.status(status).send({
            status,
            errorMessage:
                'Serwer wykrył niepożądane działanie z Twojej strony! Sprawdź poprawność wprowadzanych danych!',
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
