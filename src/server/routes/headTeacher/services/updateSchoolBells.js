import { check } from 'express-validator'
import moment from 'moment'

export default async (req, res, next) => {
    try {
        const { schoolBells: updatedSchoolBells } = req.body
        const school = await req.user.getSchool()
        if (!school) {
            throw new ApiError(`Musisz najpierw utworzyć szkołę w systemie!`, 409)
        }
        const schoolBells = await school.getSchoolBells()
        await Promise.all(schoolBells.map(async schoolBell => await schoolBell.destroy()))
        await Promise.all(
            updatedSchoolBells.map(async schoolBell => await school.createSchoolBell(schoolBell))
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
        .notEmpty()
        .custom(from => {
            if (!moment(from, 'HH:mm', true).isValid()) {
                throw new Error()
            } else {
                return from
            }
        }),
    check('schoolBells.*.to')
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
