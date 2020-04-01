import passportJwt from 'passport-jwt'

import { Admin, HeadTeacher, Teacher, Student } from '@database'

const JwtStrategy = passportJwt.Strategy
const ExtractJwt = passportJwt.ExtractJwt

export default passport => {
    const extractJwtFromCookies = ({ cookies }) => cookies.token
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
                            },
                            attributes: {
                                exclude: ['password']
                            }
                        })
                        if (!admin) {
                            done(true, {})
                        } else {
                            done(false, {
                                user: admin,
                                role
                            })
                        }
                    } catch (error) {
                        done(true, {})
                    }
                } else if (role === 'headTeacher') {
                    try {
                        const headTeacher = await HeadTeacher.findOne({
                            where: {
                                email
                            },
                            attributes: {
                                exclude: ['password']
                            }
                        })
                        if (!headTeacher) {
                            done(true, {})
                        } else {
                            done(false, {
                                user: headTeacher,
                                role
                            })
                        }
                    } catch (error) {
                        done(true, {})
                    }
                } else if (role === 'teacher') {
                    try {
                        const teacher = await Teacher.findOne({
                            where: {
                                email
                            },
                            attributes: {
                                exclude: ['password']
                            }
                        })
                        if (!teacher) {
                            done(true, {})
                        } else {
                            done(false, {
                                user: teacher,
                                role
                            })
                        }
                    } catch (error) {
                        done(true, {})
                    }
                } else if (role === 'student') {
                    try {
                        const student = await Student.findOne({
                            where: {
                                email
                            },
                            attributes: {
                                exclude: ['password']
                            }
                        })
                        if (!student) {
                            done(true, {})
                        } else {
                            done(false, {
                                user: student,
                                role
                            })
                        }
                    } catch (error) {
                        done(true, {})
                    }
                } else {
                    done(true, {})
                }
            }
        )
    )
}
