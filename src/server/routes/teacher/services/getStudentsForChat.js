import { Grade, Student } from '@database'

export default async (req, res, next) => {
    try {
        const { id } = req.user
        const schools = await req.user.getSchools({
            attributes: ['name'],
            include: [
                {
                    model: Grade,
                    attributes: ['grade'],
                    include: {
                        model: Student,
                        attributes: ['id', 'email', 'name', 'surname', 'nick', 'isActivated'],
                        where: {
                            isActivated: true
                        }
                    }
                }
            ],
            joinTableAttributes: []
        })
        res.send({
            id,
            schools
        })
    } catch (error) {
        next(error)
    }
}
