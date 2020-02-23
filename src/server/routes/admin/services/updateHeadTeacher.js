import { check } from 'express-validator'

import { HeadTeacher } from '@database'

import { ApiError, detectSanitization, detectWhiteSpaces } from '@utils'

export default async (req, res, next) => {
    try {
        const { id, email, name, surname, age } = req.body
        const headTeacher = await HeadTeacher.findOne({
            where: {
                id,
                email
            }
        })
        if (!headTeacher) {
            throw new ApiError(
                `Wystąpił niespodziewany problem przy aktualizowaniu profilu dyrektora ${name} ${surname}`,
                409
            )
        }
        await headTeacher.update({
            name,
            surname,
            age
        })
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
        .isInt()
        .escape(),
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
        .custom(detectWhiteSpaces)
        .withMessage('Wprowadź poprawne imię!')
        .bail()
        .custom(detectSanitization)
        .withMessage('Imię zawiera niedozwolone znaki!'),
    check('surname')
        .trim()
        .notEmpty()
        .withMessage('Wprowadź nazwisko!')
        .bail()
        .custom(detectWhiteSpaces)
        .withMessage('Wprowadź poprawne nazwisko!')
        .bail()
        .custom(detectSanitization)
        .withMessage('Nazwisko zawiera niedozwolone znaki!'),
    check('age')
        .trim()
        .notEmpty()
        .withMessage('Wprowadź wiek!')
        .bail()
        .isInt()
        .withMessage('Wprowadź poprawny wiek!')
        .bail()
        .isInt({ min: 24, max: 100 })
        .withMessage('Wiek musi mieścić się między 24 a 100!')
]
