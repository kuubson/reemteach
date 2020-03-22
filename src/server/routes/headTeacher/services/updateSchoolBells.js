import { check } from 'express-validator'
import moment from 'moment'
import webpush from 'web-push'

import { SchoolBell, Student, Subscription } from '@database'

const { NODEMAILER_USERNAME, REACT_APP_PUBLIC_VAPID_KEY, PRIVATE_VAPID_KEY } = process.env

webpush.setVapidDetails(
    `mailto:${NODEMAILER_USERNAME}`,
    REACT_APP_PUBLIC_VAPID_KEY,
    PRIVATE_VAPID_KEY
)

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
                                body: 'Rozkład dzwonków w Twojej szkole uległ zmianie!',
                                icon:
                                    process.env.NODE_ENV === 'development'
                                        ? `http://localhost:3001/uploads/Logo.png`
                                        : `https://reemteach.herokuapp.com/uploads/Logo.png`,
                                data: {
                                    url:
                                        process.env.NODE_ENV === 'development'
                                            ? `http://localhost:3000/uczeń/rozkład-dzwonków`
                                            : `https://reemteach.herokuapp.com/uczeń/rozkład-dzwonków`
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
            successMessage: 'Pomyślnie zaktualizowano dzwonki w szkole!'
        })
    } catch (error) {
        next(error)
    }
}

export const validation = () => [
    check('schoolBells')
        .notEmpty()
        .isArray(),
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
