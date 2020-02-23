import { Router } from 'express'

import { rateLimiter, authWithJwt, checkValidationResult } from '@middlewares'

import Services from './services'

const router = Router()

router.post(
    '/student/login',
    rateLimiter('Osiągnięto limit prób logowania! Spróbuj ponownie później!'),
    Services.login.validation(),
    checkValidationResult,
    Services.login.default
)

router.get('/teacher/getProfile', authWithJwt, Services.getProfile.default)

router.post(
    '/teacher/updateProfile',
    authWithJwt,
    Services.updateProfile.validation(),
    checkValidationResult,
    Services.updateProfile.default
)

router.post(
    '/teacher/updateDetails',
    authWithJwt,
    Services.updateDetails.validation(),
    checkValidationResult,
    Services.updateDetails.default
)

export default router
