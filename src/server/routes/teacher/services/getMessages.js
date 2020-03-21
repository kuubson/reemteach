import { check } from 'express-validator'

import { Grade, Teacher, Student, Message } from '@database'

import { detectSanitization } from '@utils'

export default async (req, res, next) => {
    try {
        const { school, grade } = req.body
        const messages = await Message.findAll({
            where: {
                school,
                grade
            },
            include: [
                {
                    model: Teacher,
                    attributes: ['id', 'name', 'surname']
                },
                {
                    model: Student,
                    attributes: ['name', 'surname', 'nick']
                }
            ]
        }).then(messages =>
            messages.map(message => {
                return {
                    ...message.dataValues,
                    teacher: message.teacher ? message.teacher.dataValues : {},
                    student: message.student ? message.student.dataValues : {}
                }
            })
        )
        res.send({
            messages
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
