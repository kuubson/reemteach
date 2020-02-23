export default async (req, res, next) => {
    try {
        const { school } = req.user
        const schoolBells = await school.getSchoolBells()
        schoolBells.sort((a, b) => {
            return new Date(`1970.01.01 ${a.from}`) - new Date(`1970.01.01 ${b.from}`)
        })
        res.send({
            schoolBells
        })
    } catch (error) {
        next(error)
    }
}
