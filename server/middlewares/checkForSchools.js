import { ApiError } from '@utils'

export default async (req, _, next) => {
    try {
        const schools = await req.user.getSchools()
        if (schools.length <= 0) {
            throw new ApiError('Nie należysz jeszcze do żadnej szkoły!', 409)
        }
        next()
    } catch (error) {
        next(error)
    }
}
