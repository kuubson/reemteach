export default async (req, res, next) => {
    try {
        const { email, name, surname, age, isActivated } = req.user
        res.send({
            email,
            name,
            surname,
            age,
            isActivated
        })
    } catch (error) {
        next(error)
    }
}
