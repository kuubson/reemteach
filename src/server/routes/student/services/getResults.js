export default async (req, res, next) => {
    try {
        const results = await req.user.getResults({ order: [['createdAt', 'DESC']] }).then(
            async results =>
                await Promise.all(
                    results.map(async result => {
                        const teacher = await result.getTeacher({
                            attributes: ['email', 'name', 'surname']
                        })
                        return {
                            ...result.dataValues,
                            teacher
                        }
                    })
                )
        )
        res.send({
            results
        })
    } catch (error) {
        next(error)
    }
}
