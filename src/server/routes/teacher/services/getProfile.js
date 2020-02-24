export default async (req, res, next) => {
    try {
        const { email, name, surname, age, description, subject, isActivated } = req.user
        res.send({
            email,
            name,
            surname,
            age,
            description,
            subject,
            isActivated
        })
    } catch (error) {
        next(error)
    }
}
