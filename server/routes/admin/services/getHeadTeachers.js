import { HeadTeacher } from '@database'

export default async (_, res, next) => {
    try {
        const headTeachers = await HeadTeacher.findAll({
            attributes: ['id', 'email', 'name', 'surname', 'age', 'isActivated', 'createdAt']
        })
        res.send({
            headTeachers
        })
    } catch (error) {
        next(error)
    }
}
