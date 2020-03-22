import { check } from 'express-validator'
import webpush from 'web-push'

import { Student, Subscription } from '@database'

import { detectSanitization } from '@utils'

const { NODEMAILER_USERNAME, REACT_APP_PUBLIC_VAPID_KEY, PRIVATE_VAPID_KEY } = process.env

webpush.setVapidDetails(
    `mailto:${NODEMAILER_USERNAME}`,
    REACT_APP_PUBLIC_VAPID_KEY,
    PRIVATE_VAPID_KEY
)

export default async (req, res, next) => {
    try {
        const { name, surname, school } = req.user
        const { title, content } = req.body
        await school.createNews({
            title,
            content
        })
        const teachers = await school.getTeachers({
            include: [Subscription]
        })
        await Promise.all(
            teachers.map(async teacher => {
                teacher.subscriptions.map(subscription => {
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
                                body: `Dyrektor ${name.substring(0, 10)} ${surname.substring(
                                    0,
                                    10
                                )} utworzył nową aktualność w szkole!`,
                                image: 'https://picsum.photos/1920/1080',
                                icon: 'https://picsum.photos/1920/1080',
                                data: {
                                    url:
                                        process.env.NODE_ENV === 'development'
                                            ? `http://localhost:3000/nauczyciel/aktualności`
                                            : `https://reemteach.herokuapp.com/nauczyciel/aktualności`
                                }
                            })
                        )
                        .catch(async ({ statusCode }) => {
                            if (statusCode === 410) {
                                await subscription.destroy()
                            }
                        })
                })
            })
        )
        const students = await school
            .getGrades({
                include: [
                    {
                        model: Student,
                        include: Subscription
                    }
                ]
            })
            .then(grades => grades.map(({ students }) => [...new Set(students)]).flat())
        await Promise.all(
            students.map(async student => {
                student.subscriptions.map(subscription => {
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
                                body: `Dyrektor ${name.substring(0, 10)} ${surname.substring(
                                    0,
                                    10
                                )} utworzył nową aktualność w szkole!`,
                                icon:
                                    process.env.NODE_ENV === 'development'
                                        ? `http://localhost:3001/uploads/Logo.png`
                                        : `https://reemteach.herokuapp.com/uploads/Logo.png`,
                                data: {
                                    url:
                                        process.env.NODE_ENV === 'development'
                                            ? `http://localhost:3000/uczeń/aktualności`
                                            : `https://reemteach.herokuapp.com/uczeń/aktualności`
                                }
                            })
                        )
                        .catch(async ({ statusCode }) => {
                            if (statusCode === 410) {
                                await subscription.destroy()
                            }
                        })
                })
            })
        )
        res.send({
            successMessage: `Pomyślnie utworzono nową wiadomość!`
        })
    } catch (error) {
        next(error)
    }
}

export const validation = () => [
    check('title')
        .trim()
        .notEmpty()
        .withMessage('Wprowadź tytuł wiadomości!')
        .bail()
        .custom(detectSanitization)
        .withMessage('Tytuł wiadomości zawiera niedozwolone znaki!'),
    check('content')
        .trim()
        .notEmpty()
        .withMessage('Wprowadź treść wiadomości!')
        .bail()
        .custom(detectSanitization)
        .withMessage('Treść wiadomości zawiera niedozwolone znaki!')
]
