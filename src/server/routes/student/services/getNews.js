export default async (req, res, next) => {
    try {
        const grade = await req.user.getGrade()
        const school = await grade.getSchool()
        const news = await school.getNews({
            order: [['createdAt', 'DESC']]
        })
        res.send({
            news
        })
    } catch (error) {
        next(error)
    }
}
