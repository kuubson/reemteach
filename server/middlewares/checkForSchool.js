import { ApiError } from '@utils'

export default async (req, _, next) => {
    try {
        const school = await req.user.getSchool()
        if (!school) {
            throw new ApiError('Musisz najpierw utworzyć szkołę w systemie!', 409)
        }
        req.user.school = school
        next()
    } catch (error) {
        next(error)
    }
}
