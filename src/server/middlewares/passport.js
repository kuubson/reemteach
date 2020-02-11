import passportJwt from 'passport-jwt'

import { Admin, HeadTeacher, Teacher, Student } from '@database'

const JwtStrategy = passportJwt.Strategy
const ExtractJwt = passportJwt.ExtractJwt

export default passport => {
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
                jwtFromRequest: ExtractJwt.fromExtractors([extractJwtFromCookies]),
                secretOrKey: process.env.JWT_KEY
            },
            async (data, done) => {
                const { email, role } = data
                if (role === 'admin') {
                    try {
                        const admin = await Admin.findOne({
                            where: {
                                email
                            }
                        })
                        if (!admin) {
                            done(null, false)
                        } else {
                            done(null, {
                                user: admin,
                                role
                            })
                        }
                    } catch (error) {
                        done(true, false)
                    }
                } else if (role === 'headTeacher') {
                    try {
                        const headTeacher = await HeadTeacher.findOne({
                            where: {
                                email
                            }
                        })
                        if (!headTeacher) {
                            done(null, false)
                        } else {
                            done(null, {
                                user: headTeacher,
                                role
                            })
                        }
                    } catch (error) {
                        done(true, false)
                    }
                } else if (role === 'teacher') {
                    try {
                        const teacher = await Teacher.findOne({
                            where: {
                                email
                            }
                        })
                        if (!teacher) {
                            done(null, false)
                        } else {
                            done(null, {
                                user: teacher,
                                role
                            })
                        }
                    } catch (error) {
                        done(true, false)
                    }
                } else if (role === 'student') {
                    try {
                        const student = await Student.findOne({
                            where: {
                                email
                            }
                        })
                        if (!student) {
                            done(null, false)
                        } else {
                            done(null, {
                                user: student,
                                role
                            })
                        }
                    } catch (error) {
                        done(true, false)
                    }
                } else {
                    done(null, false)
                }
            }
        )
    )
}
