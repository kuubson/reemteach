import { HeadTeacher } from '@database'

export default async (_, res, next) => {
    try {
        let headTeachers = await HeadTeacher.findAll({
            attributes: ['id', 'email', 'name', 'surname', 'age']
        })
        headTeachers = headTeachers.map(({ id, email, name, surname, age }) => {
            const isActivated = !!(name && surname && age)
            return {
                isActivated,
                id,
                email,
                name,
                surname,
                age
            }
        })
        res.send({
            headTeachers
        })
    } catch (error) {
        next(error)
    }
}
