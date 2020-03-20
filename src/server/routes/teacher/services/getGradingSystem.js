export default async (req, res, next) => {
    try {
        const gradingSystem = await req.user
            .getGradingSystems({
                attributes: ['id', 'grade', 'from', 'to']
            })
            .then(gradingSystem => gradingSystem.sort((first, second) => second.from - first.from))
        res.send({
            gradingSystem
        })
    } catch (error) {
        next(error)
    }
}
