import { School, SchoolBell } from '@database'

export default async (req, res, next) => {
    try {
        const grade = await req.user.getGrade({
            include: {
                model: School,
                include: {
                    model: SchoolBell,
                    attributes: ['id', 'from', 'to', 'isRecess']
                }
            }
        })
        res.send({
            schoolBells: grade.school.schoolBells.sort((first, second) => {
                return new Date(`1970.01.01 ${first.from}`) - new Date(`1970.01.01 ${second.from}`)
            })
        })
    } catch (error) {
        next(error)
    }
}
