import global from './global/global'

import admin from './admin/admin'

import headTeacher from './headTeacher/headTeacher'

import teacher from './teacher/teacher'

import student from './student/student'

export default app => {
    app.use('/api', global)

    app.use('/api', admin)

    app.use('/api', headTeacher)

    app.use('/api', teacher)

    app.use('/api', student)
}
