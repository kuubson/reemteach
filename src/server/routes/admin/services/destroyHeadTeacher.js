import { check } from 'express-validator'

import { HeadTeacher } from '@database'

import { ApiError } from '@utils'

export default async (req, res, next) => {
    try {
        const { id, email } = req.body
        const headTeacher = await HeadTeacher.findOne({
            where: {
                id,
                email
            }
        })
        if (!headTeacher) {
            throw new ApiError(
                `Wystąpił niespodziewany problem przy usuwaniu dyrektora ${email}`,
                409
            )
        }
        if (headTeacher.isActivated) {
            throw new ApiError(
                `Dyrektor ${email} aktywował już swoje konto i nie możesz go usuwać!`,
                409
            )
        }
        await headTeacher.destroy()
        res.send({
            successMessage: `Pomyślnie usunięto dyrektora ${email} z systemu!`
        })
    } catch (error) {
        next(error)
    }
}

export const validation = () => [
    check('id')
        .trim()
        .notEmpty()
        .bail()
        .isInt()
        .escape(),
    check('email')
        .trim()
        .notEmpty()
        .bail()
        .isEmail()
        .normalizeEmail()
]
