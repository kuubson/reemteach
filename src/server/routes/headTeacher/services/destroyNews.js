import { check } from 'express-validator'

import { News } from '@database'

export default async (req, res, next) => {
    try {
        const { id } = req.body
        const news = await News.findOne({
            where: {
                id
            }
        })
        await news.destroy()
        res.send({
            successMessage: `Pomyślnie usunięto aktualność o id ${id}!`
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
