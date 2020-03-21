import { check } from 'express-validator'

import { Grade } from '@database'

import { detectSanitization } from '@utils'

export default async (req, res, next) => {
    try {
        const { content, school, grade } = req.body
        await req.user.createMessage({
            content,
            school,
            grade,
            isTeacher: true
        })
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
