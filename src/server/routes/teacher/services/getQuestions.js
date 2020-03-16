export default async (req, res, next) => {
    try {
        const questions = await req.user.getQuestions().then(questions =>
            questions.map(question => {
                return {
                    ...question.dataValues,
                    initialImage: question.image
                }
            })
        )
        res.send({
            questions
        })
    } catch (error) {
        next(error)
    }
}
