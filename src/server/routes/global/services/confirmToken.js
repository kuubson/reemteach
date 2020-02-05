import jwt from 'jsonwebtoken'

import { Teacher, Student } from '@database'

export default (req, res) => {
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
                } else if (role === 'teacher') {
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
                } else if (role === 'student') {
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
}
