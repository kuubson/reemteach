export default async (req, res, next) => {
    try {
        let schools = await req.user.getSchools({
            attributes: [
                'id',
                'name',
                'type',
                'description',
                'address',
                'creationDate',
                'headTeacherId'
            ],
            joinTableAttributes: []
        })
        schools = await Promise.all(
            schools.map(async school => {
                const { email, name, surname } = await school.getHeadTeacher({
                    attributes: ['email', 'name', 'surname']
                })
                return {
                    headTeacher: `${name} ${surname}`,
                    email,
                    ...school.dataValues
                }
            })
        )
        res.send({
            schools
        })
    } catch (error) {
        next(error)
    }
}
