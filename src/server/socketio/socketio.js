import jwt from 'jsonwebtoken'

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
                    if (role === 'headTeacher') {
                        request.headTeacher = email
                        callback(null, 'headTeacher')
                    } else if (role === 'teacher') {
                        request.teacher = email
                        callback(null, 'teacher')
                    } else if (role === 'student') {
                        request.student = email
                        callback(null, 'student')
                    } else {
                        callback('Authentication error!', false)
                    }
                }
            })
        }
    })
    io.on('connection', socket => {
        console.log(socket)
    })
}
