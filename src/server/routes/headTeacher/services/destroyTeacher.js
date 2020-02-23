import { check } from 'express-validator'

import { Teacher } from '@database'

import { ApiError } from '@utils'

export default async (req, res, next) => {
    try {
        const { id, email } = req.body
        const teacher = await Teacher.findOne({
            where: {
                id
            }
        })
        if (teacher.isActivated) {
            throw new ApiError(
                `Nauczyciel ${email} aktywował już swoje konto i nie możesz go usunąć!`,
                409
            )
        }
        await teacher.destroy()
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
        .escape()
]
