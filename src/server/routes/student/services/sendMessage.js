import { check } from 'express-validator'
import webpush from 'web-push'

import { School, Teacher, Subscription } from '@database'

const { NODEMAILER_USERNAME, REACT_APP_PUBLIC_VAPID_KEY, PRIVATE_VAPID_KEY } = process.env

webpush.setVapidDetails(
    `mailto:${NODEMAILER_USERNAME}`,
    REACT_APP_PUBLIC_VAPID_KEY,
    PRIVATE_VAPID_KEY
)

export default async (req, res, next) => {
    try {
        const { name, surname } = req.user
        const { content } = req.body
        const grade = await req.user.getGrade({
            include: [
                {
                    model: School,
                    include: {
                        model: Teacher,
                        include: Subscription
                    }
                }
            ]
        })
        const school = grade.school.name
        await req.user.createMessage({
            content,
            school,
            grade: grade.grade,
            isTeacher: false
        })
        grade.school.teachers.map(teacher =>
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
                            body: `Uczeń ${name.substring(0, 10)} ${surname.substring(
                                0,
                                10
                            )} z klasy ${grade.grade} (${school}) wysłał nową wiadomość!`,
                            icon:
                                process.env.NODE_ENV === 'development'
                                    ? `http://localhost:3001/uploads/Logo.png`
                                    : `https://reemteach.herokuapp.com/uploads/Logo.png`,
                            data: {
                                url:
                                    process.env.NODE_ENV === 'development'
                                        ? `http://localhost:3000/nauczyciel/czat`
                                        : `https://reemteach.herokuapp.com/nauczyciel/czat`
                            }
                        })
                    )
                    .catch(async ({ statusCode }) => {
                        if (statusCode === 410) {
                            await subscription.destroy()
                        }
                    })
            })
        )
        res.send({
            success: true
        })
    } catch (error) {
        next(error)
    }
}

export const validation = () => [
    check('content')
        .trim()
        .notEmpty()
]
