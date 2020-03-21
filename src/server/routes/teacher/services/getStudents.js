import { Grade, Student, Result } from '@database'

export default async (req, res, next) => {
    try {
        const schools = await req.user.getSchools({
            include: [
                {
                    model: Grade,
                    include: {
                        model: Student,
                        attributes: [
                            'id',
                            'email',
                            'name',
                            'surname',
                            'age',
                            'nick',
                            'isActivated'
                        ],
                        include: Result
                    }
                }
            ],
            joinTableAttributes: []
        })
        res.send({
            schools
        })
    } catch (error) {
        next(error)
    }
}
