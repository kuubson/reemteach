import { Router } from 'express'

import { authWithJwt, checkValidationResult } from '@middlewares'

import Services from './services'

const router = Router()

router.post(
    '/admin/login',
    Services.login.validation(),
    checkValidationResult,
    Services.login.default
)

router.get('/admin/getProfile', authWithJwt, Services.getProfile.default)

export default router
