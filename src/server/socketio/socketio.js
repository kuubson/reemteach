import jwt from 'jsonwebtoken'

import { School, Teacher, Student } from '@database'

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
        socket.on('startLecture', ({ school, grade }) => {
            socket.join(grade)
            const lecturer = `${socket.teacher.name} ${socket.teacher.surname}`
            if (
                !lectures.some(
                    lecture =>
                        lecture.school === school &&
                        lecture.grade === grade &&
                        lecture.lecturer === lecturer
                )
            ) {
                lectures.push({
                    socketId: socket.id,
                    school,
                    grade,
                    lecturer
                })
            }
            io.of('/student')
                .to(grade)
                .emit('updateLectures', getLectures(school, grade))
        })
        socket.on('answerStudent', ({ socketId, answer }) => {
            io.of('/student')
                .to(socketId)
                .emit('answerStudent', {
                    socketId: socket.id,
                    answer
                })
        })
        socket.on('disconnect', () => {
            lectures = lectures.filter(lecture => lecture.socketId !== socket.id)
            io.of('/student').emit('breakLecture', socket.id)
        })
    })
    io.of('/student').on('connection', socket => {
        socket.on('getLectures', async () => {
            const { grade, school } = await socket.student.getGrade({
                include: [School]
            })
            socket.join(grade)
            socket.emit('getLectures', getLectures(school.name, grade))
        })
        socket.on('callTeacher', async ({ socketId, streamId, offer }) => {
            const { grade, school } = await socket.student.getGrade({
                include: [School]
            })
            io.of('/teacher')
                .to(socketId)
                .emit('callTeacher', {
                    socketId: socket.id,
                    offer,
                    school: school.name,
                    grade,
                    student: {
                        streamId,
                        id: socket.student.id,
                        fullName: `${socket.student.name} ${socket.student.surname}`
                    }
                })
        })
    })
}
