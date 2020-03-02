import { check } from 'express-validator'

export default (_, res, next) => {
    try {
        res.clearCookie('token', {
            secure: process.env.NODE_ENV === 'production',
            httpOnly: true,
            sameSite: true
        }).send({
            success: true
        })
    } catch (error) {
        next(error)
    }
}

export const validation = () => [
    check('token')
        .trim()
        .notEmpty()
        .isJWT()
]
