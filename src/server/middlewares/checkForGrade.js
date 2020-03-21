import { ApiError } from '@utils'

export default async (req, _, next) => {
    try {
        if (!req.user.isActivated) {
            throw new ApiError('Uzupełnij najpierw swoje dane!', 409)
        }
        if (!(await req.user.getGrade())) {
            throw new ApiError('Nie należysz jeszcze do żadnej klasy!', 409)
        }
        next()
    } catch (error) {
        next(error)
    }
}
