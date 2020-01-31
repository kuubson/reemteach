import passport from 'passport'

export default (req, res, next) => {
    const rejectUnauthorizedUser = () => {
        const status = 401
        res.status(status).send({
            status,
            errorMessage: 'Wystąpił niespodziewany problem przy autoryzacji Twojego konta!'
        })
    }
    passport.authenticate('jwt', { session: false }, (error, user) => {
        if (error || !user) {
            rejectUnauthorizedUser()
        } else {
            req.user = user
            next()
        }
    })(req, res, next)
}
