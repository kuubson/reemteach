export default async (req, res, next) => {
    try {
        const school = await req.user.getSchool()
        if (!school) {
            res.send({
                hasSchool: false
            })
        } else {
            const { name, type, description, creationDate } = school
            res.send({
                name,
                type,
                description,
                creationDate,
                hasSchool: true
            })
        }
    } catch (error) {
        next(error)
    }
}
