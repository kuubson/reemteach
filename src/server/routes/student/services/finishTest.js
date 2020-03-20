import { check } from 'express-validator'

import { GradingSystem, Question } from '@database'

import { detectSanitization } from '@utils'

export default async (req, res, next) => {
    try {
        const { questions } = req.body
        const foundQuestions = await Question.findAll({
            where: {
                id: questions.map(({ id }) => id)
            }
        })
        const [teacherId] = foundQuestions.map(({ teacherId }) => teacherId)
        const results = questions.map(
            ({ answer }, index) => answer === foundQuestions[index].properAnswer
        )
        const result = Math.floor(
            (results.filter(result => result).length / foundQuestions.length) * 100
        )
        const gradingSystem = await GradingSystem.findAll({
            where: {
                teacherId
            }
        })
        const { grade } = gradingSystem.find(({ from, to }) => result >= from && result <= to)
        res.send({
            grade
        })
    } catch (error) {
        next(error)
    }
}

export const validation = () => [
    check('questions')
        .notEmpty()
        .isArray(),
    check('questions.*.content')
        .trim()
        .notEmpty()
        .bail()
        .custom(detectSanitization),
    check('questions.*.answerA')
        .trim()
        .notEmpty()
        .bail()
        .custom(detectSanitization),
    check('questions.*.answerB')
        .trim()
        .notEmpty()
        .bail()
        .custom(detectSanitization),
    check('questions.*.answerC')
        .trim()
        .notEmpty()
        .bail()
        .custom(detectSanitization),
    check('questions.*.answerD')
        .trim()
        .notEmpty()
        .bail()
        .custom(detectSanitization),
    check('questions.*.answer')
        .trim()
        .notEmpty()
        .bail()
        .custom(detectSanitization)
        .bail()
        .isIn(['A', 'B', 'C', 'D'])
]
