import { check } from 'express-validator'
import webpush from 'web-push'

import { School, Teacher, Subscription } from '@database'

import { ApiError } from '@utils'

const { NODEMAILER_USERNAME, REACT_APP_PUBLIC_VAPID_KEY, PRIVATE_VAPID_KEY } = process.env

webpush.setVapidDetails(
    `mailto:${NODEMAILER_USERNAME}`,
    REACT_APP_PUBLIC_VAPID_KEY,
    PRIVATE_VAPID_KEY
)

export default async (req, res, next) => {
    try {
        const { name, surname, isActivated } = req.user
        if (!isActivated) {
            throw new ApiError('Uzupełnij najpierw swoje dane!', 409)
        }
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
                            body: `Uczeń ${name} ${surname} z klasy ${grade.grade} (${school}) wysłał nową wiadomość!`,
                            image: 'https://picsum.photos/1920/1080',
                            icon: 'https://picsum.photos/1920/1080',
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
