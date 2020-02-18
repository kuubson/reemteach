export default async (req, res, next) => {
    try {
        const { email, name, surname, age } = req.user
        const hasSchool = !!(await req.user.getSchool())
        const isActivated = !!(name && surname && age)
        res.send({
            email,
            name,
            surname,
            age,
            isActivated,
            hasSchool
        })
    } catch (error) {
        next(error)
    }
}
