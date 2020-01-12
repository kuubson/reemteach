const limiter = require('express-rate-limit')

module.exports = errorMessage => {
    return limiter({
        windowMs: 30 * 60 * 1000, // 30 min
        max: 10,
        handler: (req, res, next) => {
            const status = 429
            res.status(status).send({
                status,
                errorMessage
            })
        }
    })
}
