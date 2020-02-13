import { check } from 'express-validator'

import { HeadTeacher } from '@database'

import { detectSanitization } from '@utils'

export default async (req, res, next) => {
    try {
        const { id, email, name, surname, age } = req.body
        await HeadTeacher.update(
            {
                name,
                surname,
                age
            },
            {
                where: {
                    id,
                    email
                }
            }
        )
        res.send({
            successMessage: `Pomyślnie zaktualizowano profil dyrektora ${name} ${surname}!`
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
        .isInt(),
    check('email')
        .trim()
        .notEmpty()
        .bail()
        .isEmail()
        .normalizeEmail(),
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
        .isInt({ min: 14, max: 100 })
        .withMessage('Wiek musi mieścić się między 14 a 100!')
        .bail()
        .custom(detectSanitization)
        .withMessage('Wiek zawiera niedozwolone znaki!')
]
