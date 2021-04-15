export default async (req, res, next) => {
    try {
        const news = await req.user.school.getNews({
            order: [['createdAt', 'DESC']]
        })
        res.send({
            news
        })
    } catch (error) {
        next(error)
    }
}
