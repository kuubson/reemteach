import { Router } from 'express'

import { authWithJwt, checkValidationResult } from '@middlewares'

import { catchErrors } from '@utils'

import Services from './services'

const router = Router()

router.post('/admin/login', checkValidationResult, catchErrors(Services.login()))

router.get('/admin/getProfile', authWithJwt, catchErrors(Services.getProfile()))

export default router
