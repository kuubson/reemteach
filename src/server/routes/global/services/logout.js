import { check } from 'express-validator'

const main = (_, res) => {
    res.clearCookie('token', {
        secure: !process.env.NODE_ENV === 'development',
        httpOnly: true,
        sameSite: true
    }).send({
        success: true
    })
}

const validation = () => [
    check('token')
        .not()
        .isEmpty()
]

export default () => (validation, main)
