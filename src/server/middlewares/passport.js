const passportJwt = require('passport-jwt')
const JwtStrategy = passportJwt.Strategy
const ExtractJwt = passportJwt.ExtractJwt

module.exports = passport => {
    const extractJwtFromCookies = req => {
        const { token } = req.cookies
        if (token) {
            return token
        } else {
            return null
        }
    }
    passport.use(
        new JwtStrategy(
            {
                jwtFromRequest: ExtractJwt.fromExtractors([
                    extractJwtFromCookies
                ]),
                secretOrKey: process.env.JWT_KEY
            },
            async (data, done) => {}
        )
    )
}
