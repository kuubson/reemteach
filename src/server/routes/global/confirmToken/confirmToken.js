import { Router } from 'express'
import jwt from 'jsonwebtoken'

import { Teacher, Student } from '@database'

export default Router().get('/api/confirmToken', (req, res, next) => {
    const clearCookie = () => {
        res.clearCookie('token', {
            secure: !process.env.NODE_ENV === 'development',
            httpOnly: true,
            sameSite: true
        }).send({
            role: 'guest'
        })
    }
    if (req.cookies.token) {
        jwt.verify(req.cookies.token, process.env.JWT_KEY, async (error, data) => {
            if (error) {
                clearCookie()
            } else {
                const { email, role } = data
                if (role === 'headTeacher') {
                    try {
                        const headTeacher = await Teacher.findOne({
                            where: {
                                email
                            }
                        })
                        if (!headTeacher) {
                            clearCookie()
                        } else {
                            res.send({
                                role: 'headTeacher'
                            })
                        }
                    } catch (error) {
                        next(error)
                    }
                } else if (role === 'teacher') {
                    try {
                        const teacher = await Teacher.findOne({
                            where: {
                                email
                            }
                        })
                        if (!teacher) {
                            clearCookie()
                        } else {
                            res.send({
                                role: 'teacher'
                            })
                        }
                    } catch (error) {
                        next(error)
                    }
                } else if (role === 'student') {
                    try {
                        const student = await Student.findOne({
                            where: {
                                email
                            }
                        })
                        if (!student) {
                            clearCookie()
                        } else {
                            res.send({
                                role: 'student'
                            })
                        }
                    } catch (error) {
                        next(error)
                    }
                } else {
                    clearCookie()
                }
            }
        })
    } else {
        res.send({
            role: 'guest'
        })
    }
})
