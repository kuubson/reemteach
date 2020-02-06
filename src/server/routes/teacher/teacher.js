import { Router } from 'express'

import { checkValidationResult } from '@middlewares'

import { catchError } from '@utils'

import Services from './services'

const router = Router()

router.post('/teacher/login', checkValidationResult, catchError(Services.loginTeacher()))

export default router
