import { Router } from 'express'

import { checkValidationResult } from '@middlewares'

import Services from './services'

const router = Router()

router.get('/logout', Services.logout.validation(), checkValidationResult, Services.logout.default)

router.get(
    '/confirmToken',
    Services.confirmToken.validation(),
    checkValidationResult,
    Services.confirmToken.default
)

export default router
