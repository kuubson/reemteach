import { Router } from 'express'

import { authWithJwt, checkValidationResult } from '@middlewares'

import { catchErrors } from '@utils'

import Services from './services'

const router = Router()

router.get('/confirmToken', catchErrors(Services.confirmToken.default))

router.get(
    '/logout',
    authWithJwt,
    Services.logout.validation(),
    checkValidationResult,
    catchErrors(Services.logout.default)
)

export default router
