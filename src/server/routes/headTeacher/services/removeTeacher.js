import { check } from 'express-validator'

import { Teacher } from '@database'

import { ApiError } from '@utils'

export default async (req, res, next) => {
    try {
        const { school } = req.user
        const { id, email } = req.body
        const teacher = await Teacher.findOne({
            where: {
                id,
                email
            }
        })
        if (!teacher) {
            throw new ApiError(
                `Wystąpił niespodziewany problem przy usuwaniu profilu nauczyciela ${email}`,
                409
            )
        }
        if (teacher.isActivated) {
            throw new ApiError(
                `Nauczyciel ${email} aktywował już swoje konto i nie możesz go usunąć!`,
                409
            )
        }
        await school.removeTeacher(teacher)
        res.send({
            successMessage: `Pomyślnie usunięto nauczyciela ${email} ze szkoły!`
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
        .withMessage('Wprowadź adres e-mail!')
        .bail()
        .isEmail()
        .withMessage('Wprowadź poprawny adres e-mail!')
        .normalizeEmail()
]
