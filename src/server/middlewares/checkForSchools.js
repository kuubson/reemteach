import { ApiError } from '@utils'

export default async (req, _, next) => {
    try {
        const schools = await req.user.getSchools()
        if (schools.length <= 0) {
            throw new ApiError('Nie należysz do żadnej szkoły!', 409)
        } else {
            next()
        }
    } catch (error) {
        next(error)
    }
}
