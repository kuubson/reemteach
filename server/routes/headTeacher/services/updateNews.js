import { check } from 'express-validator'

import { detectSanitization } from '@utils'

export default async (req, res, next) => {
    try {
        const { school } = req.user
        const { id, title, content } = req.body
        const [news] = await school.getNews({
            where: {
                id
            }
        })
        await news.update({
            title,
            content
        })
        res.send({
            successMessage: `Pomyślnie zaktualizowano aktualność o id ${id}!`
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
    check('title')
        .trim()
        .notEmpty()
        .withMessage('Wprowadź tytuł wiadomości!')
        .bail()
        .custom(detectSanitization)
        .withMessage('Tytuł wiadomości zawiera niedozwolone znaki!'),
    check('content')
        .trim()
        .notEmpty()
        .withMessage('Wprowadź treść wiadomości!')
        .bail()
        .custom(detectSanitization)
        .withMessage('Treść wiadomości zawiera niedozwolone znaki!')
]
