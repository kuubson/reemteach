export default async (req, res, next) => {
    try {
        const { subject } = req.user
        res.send({
            subject
        })
    } catch (error) {
        next(error)
    }
}
