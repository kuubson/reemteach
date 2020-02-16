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
    authWithJwt,
    Services.updateProfile.validation(),
    checkValidationResult,
    Services.updateProfile.default
)

router.post(
    '/headTeacher/updateDetails',
    authWithJwt,
    Services.updateDetails.validation(),
    checkValidationResult,
    Services.updateDetails.default
)

router.post(
    '/headTeacher/createSchool',
    authWithJwt,
    Services.createSchool.validation(),
    checkValidationResult,
    Services.createSchool.default
)

export default router
