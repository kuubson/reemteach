export default async (req, res, next) => {
    try {
        const gradingSystem = await req.user.getGradingSystems({
            attributes: ['id', 'grade', 'from', 'to']
        })
        res.send({
            gradingSystem
        })
    } catch (error) {
        next(error)
    }
}
