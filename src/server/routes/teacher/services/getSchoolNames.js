export default async (req, res, next) => {
    try {
        let schools = await req.user.getSchools({
            attributes: ['name'],
            joinTableAttributes: []
        })
        schools = schools.map(({ name }) => name)
        res.send({
            schools
        })
    } catch (error) {
        next(error)
    }
}
