export default async (req, res, next) => {
    try {
        const { email, name, surname, age, isActivated } = req.user
        const hasSchool = !!(await req.user.getSchool())
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
