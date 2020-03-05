import jwt from 'jsonwebtoken'

import { School, Grade, Teacher, Student } from '@database'

import { getCookie } from '@utils'

export default io => {
    io.of('/teacher').use((socket, next) => {
        const token = getCookie(socket.request.headers.cookie, 'token')
        if (!token) {
            next(new Error('Authentication error!'))
        } else {
            jwt.verify(token, process.env.JWT_KEY, async (error, data) => {
                if (error) {
                    next(new Error('Authentication error!'))
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
                            next(new Error('Authentication error!'))
                        } else {
                            socket.teacher = teacher
                            next()
                        }
                    } catch (error) {
                        next(new Error('Authentication error!'))
                    }
                }
            })
        }
    })
    io.of('/student').use((socket, next) => {
        const token = getCookie(socket.request.headers.cookie, 'token')
        if (!token) {
            next(new Error('Authentication error!'))
        } else {
            jwt.verify(token, process.env.JWT_KEY, async (error, data) => {
                if (error) {
                    next(new Error('Authentication error!'))
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
                            next(new Error('Authentication error!'))
                        } else {
                            socket.student = student
                            next()
                        }
                    } catch (error) {
                        next(new Error('Authentication error!'))
                    }
                }
            })
        }
    })
    let lectures = []
    const getLectures = (school, grade) =>
        lectures
            .map(lecture => {
                if (lecture.school === school && lecture.grade === grade) {
                    return lecture
                }
            })
            .filter(lecture => lecture)
    io.of('/teacher').on('connection', socket => {
        const lecturerId = socket.teacher.id
        const lecturer = `${socket.teacher.name} ${socket.teacher.surname}`
        const lecturerRoom = `${lecturerId} ${lecturer}`
        socket.on('startLecture', ({ school, grade }) => {
            if (!lectures.some(lecture => lecture.lecturerId === lecturerId)) {
                lectures.push({
                    socketId: socket.id,
                    school,
                    grade,
                    lecturerId,
                    lecturer,
                    lecturerRoom
                })
                io.of('/student')
                    .to(grade)
                    .emit('updateLectures', getLectures(school, grade))
            }
        })
        socket.on('video', ({ video }) => {
            io.of('/student')
                .to(lecturerRoom)
                .emit('video', video)
        })
        socket.on('audio', audio =>
            io
                .of('/student')
                .to(lecturerRoom)
                .emit('audio', audio)
        )
        socket.on('disconnect', () => {
            lectures = lectures.filter(lecture => lecture.socketId !== socket.id)
            io.of('/student').emit('breakLecture', socket.id)
        })
    })
    io.of('/student').on('connection', socket => {
        socket.on('getLectures', async sendLectures => {
            const { grade, school } = socket.student.grade
            socket.join(grade)
            sendLectures(getLectures(school.name, grade))
        })
        socket.on('joinLecture', lecturerRoom => socket.join(lecturerRoom))
    })
}
