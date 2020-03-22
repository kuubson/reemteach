import webpush from 'web-push'
import cron from 'node-cron'
import { check } from 'express-validator'

import { School, SchoolBell, Grade, Student, Subscription } from '@database'

const { NODEMAILER_USERNAME, REACT_APP_PUBLIC_VAPID_KEY, PRIVATE_VAPID_KEY } = process.env

webpush.setVapidDetails(
    `mailto:${NODEMAILER_USERNAME}`,
    REACT_APP_PUBLIC_VAPID_KEY,
    PRIVATE_VAPID_KEY
)

let schoolBellsNotificationsTasks = []

export default async (req, res, next) => {
    try {
        schoolBellsNotificationsTasks.map(schoolBellsNotificationsTask =>
            schoolBellsNotificationsTask.destroy()
        )
        schoolBellsNotificationsTasks = []
        const {
            endpoint,
            keys: { p256dh, auth }
        } = req.body
        await req.user.getSubscriptions().then(async subscriptions => {
            if (!subscriptions.some(subscription => subscription.endpoint === endpoint)) {
                await req.user.createSubscription({
                    endpoint,
                    p256dh,
                    auth
                })
            }
        })
        const subscriptions = await Subscription.findAll()
        const schoolBells = await SchoolBell.findAll({
            include: School
        }).then(schoolBells =>
            schoolBells.filter(
                (v, i, a) => a.findIndex(t => t.from === v.from && t.to === v.to) === i
            )
        )
        const students = await Student.findAll({
            include: {
                model: Grade,
                include: School
            }
        })
        schoolBells.map(({ from, to, isRecess, school }) => {
            const [hours, minutes] = from.split(':')
            schoolBellsNotificationsTasks.push(
                cron.schedule(`${minutes} ${hours} * * *`, () => {
                    subscriptions.map(async subscription => {
                        if (
                            students.some(
                                student =>
                                    student.id === subscription.studentId &&
                                    student.grade.school.name === school.name
                            )
                        ) {
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
                                        body: `W Twojej szkole rozpoczyna się właśnie ${
                                            isRecess ? 'przerwa' : 'lekcja'
                                        } od ${from} do ${to}`,
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
                        }
                    })
                })
            )
        })
        res.send({
            success: true
        })
    } catch (error) {
        next(error)
    }
}

export const validation = () => [
    check('endpoint')
        .trim()
        .notEmpty(),
    check('keys.p256dh')
        .trim()
        .notEmpty(),
    check('keys.auth')
        .trim()
        .notEmpty()
]
