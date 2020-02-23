export default async (_, res, next) => {
    try {
        const school = await req.user.getSchool()
        const teachers = await school.getTeachers({
            attributes: ['id', 'email', 'name', 'surname', 'age', 'isActivated', 'createdAt']
        })
        res.send({
            teachers
        })
    } catch (error) {
        next(error)
    }
}
