import { Teacher, Question } from '@database'

import { Op } from '@utils'

export default async (req, res, next) => {
    try {
        const questions = await Question.findAll({
            where: {
                teacherId: {
                    [Op.ne]: req.user.id
                }
            },
            include: {
                model: Teacher,
                attributes: ['email', 'name', 'surname']
            }
        })
        res.send({
            questions
        })
    } catch (error) {
        next(error)
    }
}
