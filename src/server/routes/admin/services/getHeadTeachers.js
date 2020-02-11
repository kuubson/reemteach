import { HeadTeacher } from '@database'

export default async (_, res, next) => {
    try {
        const headTeachers = await HeadTeacher.findAll({
            attributes: ['email']
        })
        res.send({
            headTeachers
        })
    } catch (error) {
        next(error)
    }
}
