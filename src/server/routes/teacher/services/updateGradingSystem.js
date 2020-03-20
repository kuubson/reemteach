import { check } from 'express-validator'
import moment from 'moment'

import { GradingSystem, Student } from '@database'

import { detectSanitization } from '@utils'

export default async (req, res, next) => {
    try {
        const { gradingSystem } = req.body
        await GradingSystem.destroy({
            where: {
                teacherId: req.user.id
            }
        })
        await Promise.all(
            gradingSystem.map(
                async gradingSystem => await req.user.createGradingSystem(gradingSystem)
            )
        )
        res.send({
            successMessage: 'Pomyślnie zaktualizowano system oceniania!'
        })
    } catch (error) {
        next(error)
    }
}

export const validation = () => [
    check('gradingSystem')
        .notEmpty()
        .isArray()
        .custom(gradingSystem =>
            gradingSystem.map((currentGradingSystem, index) => {
                if (
                    (index === 0 && parseInt(currentGradingSystem.to) !== 100) ||
                    (index === gradingSystem.length - 1 &&
                        parseInt(currentGradingSystem.from) !== 0)
                ) {
                    isValidated = false
                    return {
                        ...currentGradingSystem,
                        error: 'Wprowadź poprawny zakres!'
                    }
                }
                const nextGradingSystem = gradingSystem[index + 1]
                if (nextGradingSystem) {
                    const currentFrom = currentGradingSystem.from
                    const currentTo = currentGradingSystem.to
                    const nextTo = nextGradingSystem.to
                    if (
                        currentFrom < 0 ||
                        currentFrom > 100 ||
                        currentTo < 0 ||
                        currentTo > 100 ||
                        currentTo < currentFrom ||
                        currentFrom <= nextTo ||
                        currentFrom - nextTo > 1
                    ) {
                        throw new Error()
                    } else {
                        return currentGradingSystem
                    }
                } else {
                    return currentGradingSystem
                }
            })
        ),
    check('gradingSystem.*.grade')
        .trim()
        .notEmpty()
        .bail()
        .custom(detectSanitization),
    check('gradingSystem.*.from')
        .trim()
        .notEmpty()
        .bail()
        .custom(detectSanitization),
    check('gradingSystem.*.to')
        .trim()
        .notEmpty()
        .bail()
        .custom(detectSanitization)
]
