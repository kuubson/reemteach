import { Teacher, Question } from '@database'

export default async (_, res, next) => {
    try {
        const questions = await Question.findAll({
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
