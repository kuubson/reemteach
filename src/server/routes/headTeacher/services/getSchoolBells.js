export default async (req, res, next) => {
    try {
        const { school } = req.user
        const schoolBells = await school.getSchoolBells().then(schoolBells =>
            schoolBells.sort((first, second) => {
                return new Date(`1970.01.01 ${first.from}`) - new Date(`1970.01.01 ${second.from}`)
            })
        )
        res.send({
            schoolBells
        })
    } catch (error) {
        next(error)
    }
}
