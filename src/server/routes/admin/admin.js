import { Router } from 'express'

import { checkValidationResult } from '@middlewares'

import { catchError } from '@utils'

import Services from './services'

const router = Router()

router.post('/admin/login', checkValidationResult, catchError(Services.loginAdmin()))

export default router
