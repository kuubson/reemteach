import { Router } from 'express'

import { checkValidationResult } from '@middlewares'

import { catchErrors } from '@utils'

import Services from './services'

const router = Router()

router.post('/student/login', checkValidationResult, catchErrors(Services.login()))

export default router
