export default async (req, res, next) => {
    try {
        const school = await req.user.getSchool()
        if (!school) {
            res.send({
                hasSchool: false
            })
        } else {
            const schoolBells = await school.getSchoolBells()
            schoolBells.sort((a, b) => {
                return new Date(`1970.01.01 ${a.from}`) - new Date(`1970.01.01 ${b.from}`)
            })
            res.send({
                schoolBells,
                hasSchool: true
            })
        }
    } catch (error) {
        next(error)
    }
}
