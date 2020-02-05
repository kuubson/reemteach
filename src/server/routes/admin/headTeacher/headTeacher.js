import { Router } from 'express'

import Services from './services'

const router = Router()

router.post('/admin/headTeacher', Services.createHeadTeacher)

export default router
