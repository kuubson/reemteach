import { Router } from 'express'

import { rateLimiter, authWithJwt, checkValidationResult } from '@middlewares'

import Services from './services'

const router = Router()

router.post(
    '/teacher/login',
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

router.get('/teacher/getSchoolNames', authWithJwt, Services.getSchoolNames.default)

router.get('/teacher/getSchools', authWithJwt, Services.getSchools.default)

router.post(
    '/teacher/createStudent',
    authWithJwt,
    Services.createStudent.validation(),
    checkValidationResult,
    Services.createStudent.default
)

export default router
