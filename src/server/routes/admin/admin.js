import { Router } from 'express'

import { rateLimiter, authWithJwt, checkValidationResult } from '@middlewares'

import Services from './services'

const router = Router()

router.post(
    '/admin/login',
    rateLimiter('Osiągnięto limit prób logowania! Spróbuj ponownie później!'),
    Services.login.validation(),
    checkValidationResult,
    Services.login.default
)

router.get('/admin/getProfile', authWithJwt, Services.getProfile.default)

router.post(
    '/admin/createHeadTeacher',
    authWithJwt,
    Services.createHeadTeacher.validation(),
    checkValidationResult,
    Services.createHeadTeacher.default
)

router.get('/admin/getHeadTeachers', authWithJwt, Services.getHeadTeachers.default)

export default router
