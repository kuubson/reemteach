import { check } from 'express-validator'
import moment from 'moment'

import { School } from '@database'

import { ApiError, detectSanitization } from '@utils'

export default async (req, res, next) => {
    try {
        const { name, type, description, creationDate } = req.body
        if (await req.user.getSchool()) {
            throw new ApiError(`Posiadasz już utworzoną szkołę!`, 409)
        }
        const school = await School.findOne({
            where: {
                name
            }
        })
        if (school) {
            throw new ApiError(`Szkoła o nazwie ${name} istnieje już w systemie!`, 409)
        }
        await req.user.createSchool({
            name,
            type,
            description,
            creationDate
        })
        res.send({
            successMessage: `Pomyślnie dodano szkołę ${name} do systemu!`
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
        .withMessage('Nazwa szkoły zawiera niedozwolone znaki!'),
    check('type')
        .trim()
        .notEmpty()
        .withMessage('Zaznacz typ szkoły!')
        .bail()
        .custom(detectSanitization)
        .withMessage('Typ szkoły zawiera niedozwolone znaki!'),
    check('description')
        .trim()
        .notEmpty()
        .withMessage('Wprowadź opis szkoły!'),
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
        .bail()
        .custom(detectSanitization)
        .withMessage('Data utworzenia zawiera niedozwolone znaki!')
]
