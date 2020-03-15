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
                    subscriptions.map(async ({ studentId, endpoint, p256dh, auth }) => {
                        if (
                            students.some(
                                student =>
                                    student.id === studentId &&
                                    student.grade.school.name === school.name
                            )
                        ) {
                            webpush.sendNotification(
                                {
                                    endpoint,
                                    keys: {
                                        p256dh,
                                        auth
                                    }
                                },
                                JSON.stringify({
                                    title: 'Reemteach',
                                    body: `Rozpoczyna się właśnie kolejna ${
                                        isRecess ? 'przerwa' : 'lekcja'
                                    } w szkole ${school.name} od ${from} do ${to}`,
                                    image: 'https://picsum.photos/1920/1080',
                                    icon: 'https://picsum.photos/1920/1080'
                                })
                            )
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
