import { HeadTeacher } from '@database'

export default async (_, res, next) => {
    try {
        let headTeachers = await HeadTeacher.findAll({
            attributes: ['id', 'email', 'name', 'surname', 'age', 'isActivated', 'createdAt']
        })
        headTeachers = headTeachers.map(
            ({ id, email, name, surname, age, isActivated, createdAt }) => {
                return {
                    id,
                    email,
                    name,
                    surname,
                    age,
                    isActivated,
                    createdAt
                }
            }
        )
        res.send({
            headTeachers
        })
    } catch (error) {
        next(error)
    }
}
