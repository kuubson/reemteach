import { check } from 'express-validator'
import webpush from 'web-push'

import { Grade, Student, Subscription } from '@database'

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
        const { content, school, grade } = req.body
        await req.user.createMessage({
            content,
            school,
            grade,
            isTeacher: true
        })
        const [foundSchool] = await req.user.getSchools({
            where: {
                name: school
            }
        })
        const [foundGrade] = await foundSchool.getGrades({
            where: {
                grade
            },
            include: {
                model: Student,
                include: Subscription
            }
        })
        foundGrade.students.map(({ subscriptions }) =>
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
                            body: `Nauczyciel ${name.substring(0, 10)} ${surname.substring(
                                0,
                                10
                            )} wysłał nową wiadomość!`,
                            icon:
                                process.env.NODE_ENV === 'development'
                                    ? `http://localhost:3001/uploads/Logo.png`
                                    : `https://reemteach.herokuapp.com/uploads/Logo.png`,
                            data: {
                                url:
                                    process.env.NODE_ENV === 'development'
                                        ? `http://localhost:3000/uczeń/czat`
                                        : `https://reemteach.herokuapp.com/uczeń/czat`
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
    check('content').trim().notEmpty(),
    check('school')
        .trim()
        .notEmpty()
        .bail()
        .custom(detectSanitization)
        .bail()
        .custom(async (school, { req }) => {
            const schools = await req.user
                .getSchools()
                .then(schools => schools.map(({ name }) => name))
            if (!schools.includes(school)) {
                throw new Error()
            } else {
                return school
            }
        }),
    check('grade')
        .trim()
        .notEmpty()
        .bail()
        .custom(detectSanitization)
        .bail()
        .custom(async (grade, { req }) => {
            const grades = await req.user
                .getSchools({
                    include: [Grade]
                })
                .then(schools =>
                    schools
                        .map(({ grades }) => grades)
                        .flat()
                        .map(({ grade }) => grade)
                )
            if (!grades.includes(grade)) {
                throw new Error()
            } else {
                return grade
            }
        })
]
