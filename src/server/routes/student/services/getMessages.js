import { School, Teacher, Student, Message } from '@database'

export default async (req, res, next) => {
    try {
        const { id } = req.user
        const grade = await req.user.getGrade({
            include: [School]
        })
        const school = grade.school.name
        const teachers = await grade.school.getTeachers({
            attributes: ['id', 'email', 'name', 'surname']
        })
        const messages = await Message.findAll({
            where: {
                school,
                grade: grade.grade
            },
            include: [
                {
                    model: Teacher,
                    attributes: ['email', 'name', 'surname']
                },
                {
                    model: Student,
                    attributes: ['id', 'name', 'surname', 'nick']
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
            id,
            teachers,
            messages
        })
    } catch (error) {
        next(error)
    }
}
