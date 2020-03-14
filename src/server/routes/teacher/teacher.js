import { Router } from 'express'
import { MulterError } from 'multer'

import {
    rateLimiter,
    authWithJwt,
    multer,
    checkValidationResult,
    checkForSchools
} from '@middlewares'

import { ApiError } from '@utils'

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
    (req, res, next) =>
        multer.single('image')(req, res, error => {
            switch (true) {
                case error instanceof MulterError && error.code === 'LIMIT_FILE_SIZE':
                    next(new ApiError('Wybrany plik ma za duży rozmiar!', 500))
                    break
                case req.allowedExtenstionsError:
                    next(new ApiError('Wybrany plik ma niedozwolone rozszerzenie!', 500))
                    break
                default:
                    next()
            }
        }),
    Services.createQuestion.validation(),
    checkValidationResult,
    Services.createQuestion.default
)

export default router
