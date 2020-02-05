import global from './global/global'

import adminHeadTeacher from './admin/headTeacher/headTeacher'

export default app => {
    app.use('/api', global)

    app.use('/api', adminHeadTeacher)
}
