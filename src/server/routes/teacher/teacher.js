import { Router } from 'express'

import { checkValidationResult } from '@middlewares'

import { catchErrors } from '@utils'

import Services from './services'

const router = Router()

router.post('/teacher/login', checkValidationResult, catchErrors(Services.login()))

export default router
