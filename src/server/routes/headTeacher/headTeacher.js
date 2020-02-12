import { Router } from 'express'

import { rateLimiter, authWithJwt, checkValidationResult } from '@middlewares'

import Services from './services'

const router = Router()

router.post(
    '/headTeacher/login',
    rateLimiter('Osiągnięto limit prób logowania! Spróbuj ponownie później!'),
    Services.login.validation(),
    checkValidationResult,
    Services.login.default
)

router.get('/headTeacher/getProfile', authWithJwt, Services.getProfile.default)

router.post(
    '/headTeacher/updateProfile',
    Services.updateProfile.validation(),
    checkValidationResult,
    authWithJwt,
    Services.updateProfile.default
)

export default router
