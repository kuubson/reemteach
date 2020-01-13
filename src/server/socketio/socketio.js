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
                    callback(null, true)
                }
            })
        }
    })
    io.on('connection', socket => {
        console.log(`User ${socket.id} has connected!`)
    })
}
