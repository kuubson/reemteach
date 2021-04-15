export default async (req, res, next) => {
    try {
        const schools = await req.user.getSchools().then(schools => schools.map(({ name }) => name))
        res.send({
            schools
        })
    } catch (error) {
        next(error)
    }
}
