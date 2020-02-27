import { HeadTeacher } from '@database'

export default async (req, res, next) => {
    try {
        const schools = await req.user.getSchools({
            attributes: ['id', 'name', 'type', 'description', 'address', 'creationDate'],
            include: [
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
