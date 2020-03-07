import jwt from 'jsonwebtoken'

import { School, Grade, Teacher, Student } from '@database'

import { getCookie } from '@utils'

let lectures = []

const getLectures = (school, grade) =>
    lectures
        .map(lecture => {
            if (lecture.school === school && lecture.grade === grade) {
                return lecture
            }
        })
        .filter(lecture => lecture)

export default io => {
    const teacherIo = io.of('/teacher')
    const studentIo = io.of('/student')
    teacherIo.use((socket, next) => {
        const token = getCookie(socket.request.headers.cookie, 'token')
        if (!token) {
            next(new Error())
        } else {
            jwt.verify(token, process.env.JWT_KEY, async (error, data) => {
                if (error) {
                    next(new Error())
                } else {
                    const { email } = data
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
                            next(new Error())
                        } else {
                            socket.teacher = teacher
                            next()
                        }
                    } catch (error) {
                        next(new Error())
                    }
                }
            })
        }
    })
    studentIo.use((socket, next) => {
        const token = getCookie(socket.request.headers.cookie, 'token')
        if (!token) {
            next(new Error())
        } else {
            jwt.verify(token, process.env.JWT_KEY, async (error, data) => {
                if (error) {
                    next(new Error())
                } else {
                    const { email } = data
                    try {
                        const student = await Student.findOne({
                            where: {
                                email
                            },
                            attributes: {
                                exclude: ['password']
                            },
                            include: {
                                model: Grade,
                                include: School
                            }
                        })
                        if (!student) {
                            next(new Error())
                        } else {
                            socket.student = student
                            next()
                        }
                    } catch (error) {
                        next(new Error())
                    }
                }
            })
        }
    })
    teacherIo.on('connection', socket => {
        const { id, name, surname } = socket.teacher
        const room = `${id} ${name} ${surname}`
        socket.on('startLecture', ({ school, grade, offer }) => {
            if (!lectures.some(({ lecturer }) => lecturer.id === id)) {
                socket.join(room)
                lectures.push({
                    socketId: socket.id,
                    school,
                    grade,
                    lecturer: {
                        id,
                        name,
                        surname,
                        room
                    },
                    offer
                })
                studentIo.to(grade).emit('updateLectures', getLectures(school, grade))
            }
        })
        socket.on('disconnect', () => {
            lectures = lectures.filter(({ socketId }) => socketId !== socket.id)
            studentIo.emit('breakLecture', socket.id)
        })
    })
    studentIo.on('connection', socket => {
        socket.on('getLectures', async sendLectures => {
            const { grade, school } = socket.student.grade
            socket.join(grade)
            sendLectures(getLectures(school.name, grade))
        })
        socket.on('joinLecture', ({ room, answer }) => {
            socket.join(room)
            teacherIo.to(room).emit('joinLecture', answer)
        })
    })
}
