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
        const { name, surname } = req.user
        const { school, grade } = req.body
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
                                8
                            )} zaczął właśnie przygotowywać test!`,
                            image: 'https://picsum.photos/1920/1080',
                            icon: 'https://picsum.photos/1920/1080',
                            data: {
                                url:
                                    process.env.NODE_ENV === 'development'
                                        ? `http://localhost:3000/uczeń/test`
                                        : `https://reemteach.herokuapp.com/uczeń/test`
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
        .isIn([
            '1A',
            '1B',
            '1C',
            '1D',
            '1E',
            '1F',
            '1G',
            '1H',
            '1I',
            '1J',
            '1K',
            '1L',
            '1M',
            '2A',
            '2B',
            '2C',
            '2D',
            '2E',
            '2F',
            '2G',
            '2H',
            '2I',
            '2J',
            '2K',
            '2L',
            '2M',
            '3A',
            '3B',
            '3C',
            '3D',
            '3E',
            '3F',
            '3G',
            '3H',
            '3I',
            '3J',
            '3K',
            '3L',
            '3M',
            '4A',
            '4B',
            '4C',
            '4D',
            '4E',
            '4F',
            '4G',
            '4H',
            '4I',
            '4J',
            '4K',
            '4L',
            '4M'
        ])
]
