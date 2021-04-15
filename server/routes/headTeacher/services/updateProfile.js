import { check } from 'express-validator'
import bcrypt from 'bcryptjs'

import { detectSanitization, detectWhiteSpaces } from '@utils'

export default async (req, res, next) => {
    try {
        const { name, surname, age, password } = req.body
        await req.user.update({
            name,
            surname,
            age,
            password: bcrypt.hashSync(password, 11),
            isActivated: true
        })
        res.send({
            successMessage: 'Pomyślnie zaktualizowano hasło oraz profil!'
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
        .withMessage('Wiek musi mieścić się między 24 a 100!'),
    check('password')
        .notEmpty()
        .withMessage('Wprowadź hasło!')
        .bail()
        .matches(/^(?=.{10,})/)
        .withMessage('Hasło musi zawierać conajmniej 10 znaków!')
        .bail()
        .matches(/^(?=.*[a-z])/)
        .withMessage('Hasło musi zawierać małe litery!')
        .bail()
        .matches(/^(?=.*[A-Z])/)
        .withMessage('Hasło musi zawierać duże litery!')
        .bail()
        .matches(/^(?=.*[0-9])/)
        .withMessage('Hasło musi zawierać cyfry!'),
    check('repeatedPassword')
        .notEmpty()
        .withMessage('Powtórz hasło!')
        .bail()
        .custom((repeatedPassword, { req }) => {
            if (repeatedPassword !== req.body.password) {
                throw new Error()
            } else {
                return repeatedPassword
            }
        })
        .withMessage('Hasła różnią się od siebie!')
]
