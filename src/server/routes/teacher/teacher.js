import { Router } from 'express'

import {
    rateLimiter,
    authWithJwt,
    handleMulterErrors,
    checkValidationResult,
    checkForSchools
} from '@middlewares'

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
    checkForSchools,
    Services.createStudent.validation(),
    checkValidationResult,
    Services.createStudent.default
)

router.get('/teacher/getStudents', authWithJwt, Services.getStudents.default)

router.get('/teacher/getSubject', authWithJwt, Services.getSubject.default)

router.post(
    '/teacher/createQuestion',
    authWithJwt,
    handleMulterErrors('image'),
    Services.createQuestion.validation(),
    checkValidationResult,
    Services.createQuestion.default
)

router.get('/teacher/getQuestions', authWithJwt, Services.getQuestions.default)

router.post(
    '/teacher/destroyQuestion',
    authWithJwt,
    Services.destroyQuestion.validation(),
    checkValidationResult,
    Services.destroyQuestion.default
)

router.post(
    '/teacher/updateQuestion',
    authWithJwt,
    handleMulterErrors('newImage'),
    Services.updateQuestion.validation(),
    checkValidationResult,
    Services.updateQuestion.default
)

router.get('/teacher/getAllQuestions', authWithJwt, Services.getAllQuestions.default)

router.post(
    '/teacher/getTest',
    authWithJwt,
    Services.getTest.validation(),
    checkValidationResult,
    Services.getTest.default
)

router.post(
    '/teacher/sendTestNotification',
    authWithJwt,
    Services.sendTestNotification.validation(),
    checkValidationResult,
    Services.sendTestNotification.default
)

router.post(
    '/teacher/sendLectureNotification',
    authWithJwt,
    Services.sendLectureNotification.validation(),
    checkValidationResult,
    Services.sendLectureNotification.default
)

router.get('/teacher/getGradingSystem', authWithJwt, Services.getGradingSystem.default)

router.post(
    '/teacher/updateGradingSystem',
    authWithJwt,
    Services.updateGradingSystem.validation(),
    checkValidationResult,
    Services.updateGradingSystem.default
)

router.post(
    '/teacher/createSubscription',
    authWithJwt,
    Services.createSubscription.validation(),
    checkValidationResult,
    Services.createSubscription.default
)

export default router
