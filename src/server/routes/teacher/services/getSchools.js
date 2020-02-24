export default async (req, res, next) => {
    try {
        const schools = await req.user.getSchools({
            attributes: ['id', 'name', 'type', 'description', 'address', 'creationDate'],
            joinTableAttributes: []
        })
        res.send({
            schools
        })
    } catch (error) {
        next(error)
    }
}
