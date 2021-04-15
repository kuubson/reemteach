import jwt from 'jsonwebtoken'

import { School, Grade, Teacher, Student } from '@database'

import { getCookie } from '@utils'

let lectures = []
let takenRooms = []
let teachers = []
let studentsForTest = []
let students = []

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
        const { id, name, surname, email } = socket.teacher
        const room = `${id} ${name} ${surname}`
        if (!teachers.some(teacher => teacher.id === id)) {
            teachers.push({
                id
            })
            studentIo.emit('updateOnlineTeachers', teachers)
        }
        socket.on('startLecture', ({ school, grade }) => {
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
                    }
                })
                studentIo.to(grade).emit('updateLectures', getLectures(school, grade))
            }
        })
        socket.on('getOnlineStudents', returnOnlineStudents => returnOnlineStudents(students))
        socket.on('joinRoom', room => socket.join(room))
        socket.on('leaveRoom', room => socket.leave(room))
        socket.on('sendMessage', ({ school, grade, content }) => {
            studentIo.to(`${school} ${grade}`).emit('sendMessage', {
                content,
                teacher: {
                    name,
                    surname,
                    email
                }
            })
        })
        socket.on('answer', answer => studentIo.emit('answer', answer))
        socket.on('candidate', candidate => studentIo.emit('candidate', candidate))
        socket.on('finishLecture', () => {
            studentIo.to(room).emit('finishLecture', room)
            studentIo.emit('breakLecture', {
                socketId: socket.id,
                room
            })
            lectures = lectures.filter(({ socketId }) => socketId !== socket.id)
            takenRooms = takenRooms.filter(takenRoom => takenRoom !== room)
        })
        socket.on('leaveLecture', () => {
            studentIo.emit('breakLecture', {
                socketId: socket.id,
                room
            })
            lectures = lectures.filter(({ socketId }) => socketId !== socket.id)
            takenRooms = takenRooms.filter(takenRoom => takenRoom !== room)
        })
        socket.on('getStudents', ({ school, grade }, returnStudents) => {
            socket.join(`${school} ${grade}`)
            returnStudents(
                studentsForTest.filter(
                    student => student.school === school && student.grade === grade
                )
            )
        })
        socket.on('sendTest', ({ school, grade, questions }) => {
            const questionsWithoutAnswer = questions.map(question => {
                delete question.properAnswer
                return question
            })
            studentIo.to(`${school} ${grade}`).emit('sendTest', {
                teacherId: id,
                teacher: `${name} ${surname}`,
                questions: questionsWithoutAnswer
            })
        })
        socket.on('disconnect', () => {
            lectures = lectures.filter(({ socketId }) => socketId !== socket.id)
            takenRooms = takenRooms.filter(takenRoom => takenRoom !== room)
            studentIo.emit('breakLecture', {
                socketId: socket.id,
                room
            })
            teachers = teachers.filter(teacher => teacher.id !== id)
            studentIo.emit('updateOnlineTeachers', teachers)
        })
    })
    studentIo.on('connection', socket => {
        const {
            id,
            name,
            surname,
            nick,
            grade: { grade, school }
        } = socket.student
        const room = `${school.name} ${grade}`
        if (!students.some(student => student.id === id)) {
            students.push({
                id
            })
            teacherIo.emit('updateOnlineStudents', students)
        }
        socket.on('sendMessage', ({ content }) => {
            teacherIo.to(room).emit('sendMessage', {
                content,
                student: {
                    name,
                    surname,
                    nick
                }
            })
        })
        socket.join(room)
        socket.on('getLectures', sendLectures => {
            const { grade, school } = socket.student.grade
            socket.join(grade)
            sendLectures(getLectures(school.name, grade))
        })
        socket.on('getOnlineTeachers', returnOnlineTeachers => returnOnlineTeachers(teachers))
        socket.on('checkRoom', (room, callback) => {
            if (takenRooms.some(takenRoom => takenRoom === room)) {
                callback(true)
            } else {
                takenRooms.push(room)
                callback(false)
            }
        })
        socket.on('call', ({ room, offer }) => {
            socket.join(room)
            teacherIo.emit('call', {
                student: {
                    name,
                    surname
                },
                offer
            })
        })
        socket.on('leaveRoom', room => socket.leave(room))
        socket.on('leaveLecture', room => {
            socket.leave(room)
            teacherIo.to(room).emit('leaveLecture')
        })
        socket.on('candidate', candidate => teacherIo.emit('candidate', candidate))
        socket.on('joinTest', () => {
            if (!studentsForTest.some(student => student.id === id)) {
                const student = {
                    id,
                    name,
                    surname,
                    school: school.name,
                    grade
                }
                studentsForTest.push(student)
                teacherIo.to(room).emit('newStudent', student)
            }
        })
        socket.on('receiveTest', () => teacherIo.to(room).emit('receiveTest', id))
        socket.on('leaveTest', () => {
            studentsForTest = studentsForTest.filter(student => student.id !== id)
            teacherIo.emit('studentLeavesTest', id)
        })
        socket.on('disconnect', () => {
            teacherIo.emit('studentLeavesLecture', {
                name,
                surname
            })
            studentsForTest = studentsForTest.filter(student => student.id !== id)
            students = students.filter(student => student.id !== id)
            teacherIo.emit('studentLeavesTest', id)
            teacherIo.emit('updateOnlineStudents', students)
        })
    })
}
