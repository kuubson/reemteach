import { check } from 'express-validator'
import bcrypt from 'bcryptjs'

import { Student } from '@database'

import { detectSanitization, detectWhiteSpaces } from '@utils'

export default async (req, res, next) => {
    try {
        const { name, surname, age, nick, password } = req.body
        await req.user.update({
            name,
            surname,
            age,
            nick,
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
        .isInt({ min: 14, max: 100 })
        .withMessage('Wiek musi mieścić się między 14 a 100!'),
    check('nick')
        .trim()
        .notEmpty()
        .withMessage('Wprowadź pseudonim!')
        .bail()
        .custom(detectSanitization)
        .withMessage('Pseudonim zawiera niedozwolone znaki!')
        .bail()
        .custom(async nick => {
            const student = await Student.findOne({
                where: {
                    nick
                }
            })
            if (student) {
                throw new Error()
            } else {
                return student
            }
        })
        .withMessage(nick => `Pseudonim ${nick} jest zajęty!`),
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
