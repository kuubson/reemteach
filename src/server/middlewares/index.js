import express from 'express'
import cookieParser from 'cookie-parser'
import helmet from 'helmet'
import passport from 'passport'
import io from 'socket.io'
import csurf from 'csurf'

import errorHandler from './errorHandler'
import checkValidationResult from './checkValidationResult'
import rateLimiter from './rateLimiter'
import authWithJwt from './authWithJwt'

import passportjs from './passport'
import socketio from '../socketio/socketio'

passportjs(passport)

const initializeMiddlewares = (app, server) => {
    socketio(io(server))
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))
    app.use(passport.initialize())
    app.use(cookieParser())
    app.use(helmet())
    app.use(
        csurf({
            cookie: {
                secure: !process.env.NODE_ENV === 'development',
                httpOnly: true,
                sameSite: true
            }
        })
    )
    app.use((req, res, next) => {
        res.cookie('XSRF-TOKEN', req.csrfToken(), {
            secure: !process.env.NODE_ENV === 'development',
            sameSite: true
        })
        next()
    })
    app.set('trust proxy', 1)
}

export { initializeMiddlewares, errorHandler, checkValidationResult, rateLimiter, authWithJwt }
