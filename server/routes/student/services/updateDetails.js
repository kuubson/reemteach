import { check } from 'express-validator'

import { Student } from '@database'

import { Op, detectSanitization, detectWhiteSpaces } from '@utils'

export default async (req, res, next) => {
    try {
        const { name, surname, age, nick } = req.body
        await req.user.update({
            name,
            surname,
            age,
            nick
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
        .custom(async (nick, { req }) => {
            const student = await Student.findOne({
                where: {
                    nick,
                    email: {
                        [Op.ne]: req.user.email
                    }
                }
            })
            if (student) {
                throw new Error()
            } else {
                return student
            }
        })
        .withMessage(nick => `Pseudonim ${nick} jest zajęty!`)
]
