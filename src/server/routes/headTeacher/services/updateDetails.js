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
            successMessage: 'Pomyślnie zaktualizowano profil!'
        })
    } catch (error) {
        next(error)
    }
}

export const validation = () => [
    check('name')
        .trim()
        .notEmpty()
        .withMessage('Wprowadź imię!')
        .bail()
        .custom(detectSanitization)
        .withMessage('Imię zawiera niedozwolone znaki!'),
    check('surname')
        .trim()
        .notEmpty()
        .withMessage('Wprowadź nazwisko!')
        .bail()
        .custom(detectSanitization)
        .withMessage('Nazwisko zawiera niedozwolone znaki!'),
    check('age')
        .trim()
        .notEmpty()
        .withMessage('Wprowadź wiek!')
        .bail()
        .isInt({ min: 24, max: 100 })
        .withMessage('Wiek musi mieścić się między 24 a 100!')
        .bail()
        .custom(detectSanitization)
        .withMessage('Wiek zawiera niedozwolone znaki!')
]
