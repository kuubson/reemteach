import { Router } from 'express'

import Services from './services'

const router = Router()

router.get('/confirmToken', Services.confirmToken)

router.get('/logout', Services.logout)

export default router
