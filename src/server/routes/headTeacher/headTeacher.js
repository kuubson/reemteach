import { Router } from 'express'

import { checkValidationResult } from '@middlewares'

import { catchError } from '@utils'

import Services from './services'

const router = Router()

router.post('/headTeacher/login', checkValidationResult, catchError(Services.loginHeadTeacher()))

export default router
