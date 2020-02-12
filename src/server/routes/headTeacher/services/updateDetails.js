import { check } from 'express-validator'

import { detectSanitization } from '@utils'

export default async (req, res, next) => {
    try {
        const { name, surname, age } = req.body
        await req.user.update({
            name,
            surname,
            age
        })
        res.send({
            success: true
        })
    } catch (error) {
        next(error)
    }
}

export const validation = () => [
    check('name')
        .not()
        .isEmpty()
        .withMessage('Wprowadź imię!')
        .bail()
        .custom(detectSanitization)
        .withMessage('Imię zawiera niedozwolone znaki!'),
    check('surname')
        .not()
        .isEmpty()
        .withMessage('Wprowadź nazwisko!')
        .bail()
        .custom(detectSanitization)
        .withMessage('Nazwisko zawiera niedozwolone znaki!'),
    check('age')
        .not()
        .isEmpty()
        .withMessage('Wprowadź wiek!')
        .bail()
        .isInt({ min: 14, max: 100 })
        .withMessage('Wiek musi mieścić się między 14 a 100!')
        .bail()
        .custom(detectSanitization)
        .withMessage('Wiek zawiera niedozwolone znaki!')
]
