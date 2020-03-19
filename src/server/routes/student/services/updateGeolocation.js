import { check } from 'express-validator'

export default async (req, res, next) => {
    try {
        const { latitude, longitude } = req.body
        await req.user.update({
            geolocation: `${latitude}, ${longitude}`
        })
        res.send({
            success: true
        })
    } catch (error) {
        next(error)
    }
}

export const validation = () => [
    check('latitude')
        .trim()
        .notEmpty(),
    check('longitude')
        .trim()
        .notEmpty()
]
