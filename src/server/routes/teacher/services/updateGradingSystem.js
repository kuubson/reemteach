import { check } from 'express-validator'

import { GradingSystem } from '@database'

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
        const foundGradingSystem = await req.user
            .getGradingSystems({
                attributes: ['id', 'grade', 'from', 'to']
            })
            .then(gradingSystem => gradingSystem.sort((first, second) => second.from - first.from))
        res.send({
            successMessage: 'Pomyślnie zaktualizowano system oceniania!',
            gradingSystem: foundGradingSystem
        })
    } catch (error) {
        next(error)
    }
}

export const validation = () => [
    check('gradingSystem')
        .notEmpty()
        .isArray()
        .custom(gradingSystem => {
            if (gradingSystem.length !== 5) {
                throw new Error()
            } else {
                return gradingSystem.map((currentGradingSystem, index) => {
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
                            parseInt(currentFrom) < 0 ||
                            parseInt(currentFrom) > 100 ||
                            parseInt(currentTo) < 0 ||
                            parseInt(currentTo) > 100 ||
                            parseInt(currentTo) < parseInt(currentFrom) ||
                            parseInt(currentFrom) <= parseInt(nextTo) ||
                            parseInt(currentFrom) - parseInt(nextTo) > 1
                        ) {
                            throw new Error()
                        } else {
                            return currentGradingSystem
                        }
                    } else {
                        return currentGradingSystem
                    }
                })
            }
        }),
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
