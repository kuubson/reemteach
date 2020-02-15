import jwt from 'jsonwebtoken'

import { Teacher, Student } from '@database'

import { getCookie } from '@utils'

export default io => {
    io.set('authorization', (request, callback) => {
        const token = getCookie(request.headers.cookie, 'token')
        if (!token) {
            callback('Authentication error!', false)
        } else {
            jwt.verify(token, process.env.JWT_KEY, async (error, data) => {
                if (error) {
                    callback('Authentication error!', false)
                } else {
                    const { email, role } = data
                    if (role === 'teacher') {
                        try {
                            const teacher = await Teacher.findOne({
                                where: {
                                    email
                                }
                            })
                            if (!teacher) {
                                callback('Authentication error!', false)
                            } else {
                                request.teacher = email
                                callback(null, true)
                            }
                        } catch (error) {
                            callback('Authentication error!', false)
                        }
                    } else if (role === 'student') {
                        try {
                            const student = await Student.findOne({
                                where: {
                                    email
                                }
                            })
                            if (!student) {
                                callback('Authentication error!', false)
                            } else {
                                request.student = email
                                callback(null, true)
                            }
                        } catch (error) {
                            callback('Authentication error!', false)
                        }
                    } else {
                        callback('Authentication error!', false)
                    }
                }
            })
        }
    })
    io.on('connection', socket => {})
}
