import { Router } from 'express'

import { authWithJwt, checkValidationResult } from '@middlewares'

import Services from './services'

const router = Router()

router.get(
    '/logout',
    authWithJwt,
    Services.logout.validation(),
    checkValidationResult,
    Services.logout.default
)

router.get('/confirmToken', Services.confirmToken.default)

export default router
