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

router.post(
    '/student/subscribeSchoolBells',
    authWithJwt,
    Services.subscribeSchoolBells.validation(),
    checkValidationResult,
    Services.subscribeSchoolBells.default
)

router.get('/student/getProfile', authWithJwt, Services.getProfile.default)

router.post(
    '/student/updateProfile',
    authWithJwt,
    Services.updateProfile.validation(),
    checkValidationResult,
    Services.updateProfile.default
)

router.post(
    '/student/updateDetails',
    authWithJwt,
    Services.updateDetails.validation(),
    checkValidationResult,
    Services.updateDetails.default
)

router.post(
    '/student/updateGeolocation',
    authWithJwt,
    Services.updateGeolocation.validation(),
    checkValidationResult,
    Services.updateGeolocation.default
)

router.get('/student/getSchoolBells', authWithJwt, Services.getSchoolBells.default)

router.post(
    '/student/finishTest',
    authWithJwt,
    Services.finishTest.validation(),
    checkValidationResult,
    Services.finishTest.default
)

router.get('/student/getMessages', authWithJwt, Services.getMessages.default)

router.post(
    '/student/sendMessage',
    authWithJwt,
    Services.sendMessage.validation(),
    checkValidationResult,
    Services.sendMessage.default
)

export default router
