export default async (req, res, next) => {
    try {
        const { email, name, surname, age, nick, isActivated } = req.user
        res.send({
            email,
            name,
            surname,
            age,
            nick,
            isActivated
        })
    } catch (error) {
        next(error)
    }
}
