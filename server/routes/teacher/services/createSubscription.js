import { check } from 'express-validator'

export default async (req, res, next) => {
    try {
        const {
            endpoint,
            keys: { p256dh, auth }
        } = req.body
        await req.user.getSubscriptions().then(async subscriptions => {
            if (!subscriptions.some(subscription => subscription.endpoint === endpoint)) {
                await req.user.createSubscription({
                    endpoint,
                    p256dh,
                    auth
                })
            }
        })
        res.send({
            success: true
        })
    } catch (error) {
        next(error)
    }
}

export const validation = () => [
    check('endpoint')
        .trim()
        .notEmpty(),
    check('keys.p256dh')
        .trim()
        .notEmpty(),
    check('keys.auth')
        .trim()
        .notEmpty()
]
