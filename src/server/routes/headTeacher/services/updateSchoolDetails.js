import { check } from 'express-validator'
import moment from 'moment'

import { School } from '@database'

import { Op, detectSanitization } from '@utils'

export default async (req, res, next) => {
    try {
        const { school } = req
        const { name, type, description, address, creationDate } = req.body
        school.update({
            name,
            type,
            description,
            address,
            creationDate
        })
        res.send({
            successMessage: 'Pomyślnie zaktualizowano informacje o szkole!'
        })
    } catch (error) {
        next(error)
    }
}

export const validation = () => [
    check('name')
        .trim()
        .notEmpty()
        .withMessage('Wprowadź nazwę szkoły!')
        .bail()
        .custom(detectSanitization)
        .withMessage('Nazwa szkoły zawiera niedozwolone znaki!')
        .bail()
        .custom(async (name, { req }) => {
            const school = await School.findOne({
                where: {
                    name,
                    headTeacherId: {
                        [Op.ne]: req.user.id
                    }
                }
            })
            if (school) {
                throw new Error()
            } else {
                return school
            }
        })
        .withMessage(name => `Szkoła o nazwie ${name} istnieje już w systemie!`),
    check('type')
        .trim()
        .notEmpty()
        .withMessage('Zaznacz rodzaj szkoły!')
        .bail()
        .custom(detectSanitization)
        .withMessage('Rodzaj szkoły zawiera niedozwolone znaki!'),
    check('description')
        .trim()
        .notEmpty()
        .withMessage('Wprowadź opis szkoły!'),
    check('address')
        .trim()
        .notEmpty()
        .withMessage('Wprowadź adres szkoły!')
        .bail()
        .custom(detectSanitization)
        .withMessage('Adres szkoły zawiera niedozwolone znaki!'),
    check('creationDate')
        .trim()
        .notEmpty()
        .withMessage(`Wprowadź datę utworzenia szkoły (np. ${moment().format('DD.MM.YYYY')})!`)
        .bail()
        .custom(creationDate => {
            if (!moment(creationDate, 'DD.MM.YYYY', true).isValid()) {
                throw new Error('')
            } else {
                return creationDate
            }
        })
        .withMessage(
            `Wprowadź poprawną date utworzenia szkoły (np. ${moment().format('DD.MM.YYYY')})!`
        )
]
