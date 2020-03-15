import { School } from '@database'

export default async (req, res, next) => {
    try {
        const { grade, school } = await req.user.getGrade({
            include: School
        })
        const { email, name, surname, age, nick, isActivated } = req.user
        res.send({
            school: school.name,
            grade,
            email,
            name,
            surname,
            age,
            nick,
            isActivated
        })
    } catch (error) {
        next(error)
    }
}
