import passport from 'passport'

export default (req, res, next) => {
    const rejectUnauthorizedUser = () => {
        const status = 401
        res.clearCookie('token', {
            secure: process.env.NODE_ENV === 'production',
            httpOnly: true,
            sameSite: true
        })
            .status(status)
            .send({
                status,
                errorMessage: 'Wystąpił niespodziewany problem przy autoryzacji Twojego konta!'
            })
    }
    passport.authenticate('jwt', { session: false }, (error, { user, role }) => {
        if (error || !user || role !== req.path.split('/')[1]) {
            rejectUnauthorizedUser()
        } else {
            req.user = user
            next()
        }
    })(req, res, next)
}
