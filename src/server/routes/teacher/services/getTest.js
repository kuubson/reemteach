import { check } from 'express-validator'

import { Grade } from '@database'

export default async (req, res, next) => {
    try {
        const { test } = req.body
        const schools = await req.user
            .getSchools({
                attributes: ['name'],
                include: [
                    {
                        model: Grade,
                        attributes: ['grade']
                    }
                ]
            })
            .then(schools => schools.filter(({ grades }) => grades.length > 0))
        const questions = await req.user.getQuestions({
            where: {
                id: test.map(({ id }) => id)
            }
        })
        res.send({
            schools,
            questions
        })
    } catch (error) {
        next(error)
    }
}

export const validation = () => [
    check('test').isArray(),
    check('test.*.id')
        .trim()
        .notEmpty()
        .bail()
        .isInt()
        .escape()
]
