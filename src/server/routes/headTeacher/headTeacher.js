import { Router } from 'express'

import { rateLimiter, authWithJwt, checkValidationResult, checkForSchool } from '@middlewares'

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

router.get('/headTeacher/getSchool', authWithJwt, Services.getSchool.default)

router.post(
    '/headTeacher/updateSchoolDetails',
    authWithJwt,
    checkForSchool,
    Services.updateSchoolDetails.validation(),
    checkValidationResult,
    Services.updateSchoolDetails.default
)

router.get(
    '/headTeacher/getSchoolBells',
    authWithJwt,
    checkForSchool,
    Services.getSchoolBells.default
)

router.post(
    '/headTeacher/updateSchoolBells',
    authWithJwt,
    checkForSchool,
    Services.updateSchoolBells.validation(),
    checkValidationResult,
    Services.updateSchoolBells.default
)

router.post(
    '/headTeacher/createTeacher',
    authWithJwt,
    checkForSchool,
    Services.createTeacher.validation(),
    checkValidationResult,
    Services.createTeacher.default
)

router.get('/headTeacher/getTeachers', authWithJwt, checkForSchool, Services.getTeachers.default)

router.post(
    '/headTeacher/removeTeacher',
    authWithJwt,
    checkForSchool,
    Services.removeTeacher.validation(),
    checkValidationResult,
    Services.removeTeacher.default
)

export default router
