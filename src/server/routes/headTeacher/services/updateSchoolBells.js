import { check } from 'express-validator'
import moment from 'moment'

import { SchoolBell } from '@database'

export default async (req, res, next) => {
    try {
        const { school } = req.user
        const { schoolBells } = req.body
        await SchoolBell.destroy({
            where: {
                schoolId: school.id
            }
        })
        await Promise.all(
            schoolBells.map(async schoolBell => await school.createSchoolBell(schoolBell))
        )
        res.send({
            successMessage: 'Pomyślnie zaktualizowano dzwonki w szkole!'
        })
    } catch (error) {
        next(error)
    }
}

export const validation = () => [
    check('schoolBells')
        .notEmpty()
        .isArray()
        .custom(schoolBells => {
            if (schoolBells.length < 1) {
                throw new Error()
            } else {
                return schoolBells
            }
        }),
    check('schoolBells.*.from')
        .trim()
        .notEmpty()
        .custom(from => {
            if (!moment(from, 'HH:mm', true).isValid()) {
                throw new Error()
            } else {
                return from
            }
        }),
    check('schoolBells.*.to')
        .trim()
        .notEmpty()
        .custom(to => {
            if (!moment(to, 'HH:mm', true).isValid()) {
                throw new Error()
            } else {
                return to
            }
        }),
    check('schoolBells.*.isRecess')
        .notEmpty()
        .isBoolean()
]
