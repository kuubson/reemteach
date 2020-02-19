import { check } from 'express-validator'

import { HeadTeacher } from '@database'

export default async (req, res, next) => {
    try {
        const { id, email } = req.body
        await HeadTeacher.destroy({
            where: {
                id
            }
        })
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
        .escape()
]
