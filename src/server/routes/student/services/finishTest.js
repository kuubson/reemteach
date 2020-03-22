import { check } from 'express-validator'
import webpush from 'web-push'

import { School, Teacher, GradingSystem, Question, Subscription } from '@database'

import { detectSanitization } from '@utils'

const { NODEMAILER_USERNAME, REACT_APP_PUBLIC_VAPID_KEY, PRIVATE_VAPID_KEY } = process.env

webpush.setVapidDetails(
    `mailto:${NODEMAILER_USERNAME}`,
    REACT_APP_PUBLIC_VAPID_KEY,
    PRIVATE_VAPID_KEY
)

export default async (req, res, next) => {
    try {
        const { name, surname } = req.user
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
        const createdResult = await req.user.createResult({
            grade,
            questions: questions.map(({ id }) => id).join()
        })
        const teacher = await Teacher.findOne({
            where: {
                id: teacherId
            }
        })
        await createdResult.setTeacher(teacher)
        const subscriptions = await Subscription.findAll({
            where: {
                teacherId
            }
        })
        const { grade: studentGrade, school } = await req.user.getGrade({
            include: School
        })
        subscriptions.map(subscription => {
            webpush
                .sendNotification(
                    {
                        endpoint: subscription.endpoint,
                        keys: {
                            p256dh: subscription.p256dh,
                            auth: subscription.auth
                        }
                    },
                    JSON.stringify({
                        title: 'Reemteach',
                        body: `Uczeń ${name.substring(0, 10)} ${surname.substring(
                            0,
                            8
                        )} z klasy ${studentGrade} (${
                            school.name
                        }) zakończył test z oceną ${grade}!`,
                        icon:
                            process.env.NODE_ENV === 'development'
                                ? `http://localhost:3001/uploads/Logo.png`
                                : `https://reemteach.herokuapp.com/uploads/Logo.png`
                    })
                )
                .catch(async ({ statusCode }) => {
                    if (statusCode === 410) {
                        await subscription.destroy()
                    }
                })
        })
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
