import { SchoolBell, HeadTeacher } from '@database'

export default async (req, res, next) => {
    try {
        const schools = await req.user.getSchools({
            attributes: ['id', 'name', 'type', 'description', 'address', 'creationYear'],
            include: [
                {
                    model: SchoolBell,
                    attributes: ['id', 'from', 'to', 'isRecess']
                },
                {
                    model: HeadTeacher,
                    attributes: ['email', 'name', 'surname']
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
