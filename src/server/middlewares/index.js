import express from 'express'
import cookieParser from 'cookie-parser'
import helmet from 'helmet'
import passport from 'passport'
import io from 'socket.io'
import csurf from 'csurf'

import errorsHandler from './errorsHandler'
import checkValidationResult from './checkValidationResult'
import rateLimiter from './rateLimiter'
import authWithJwt from './authWithJwt'
import multer from './multer'
import handleMulterErrors from './handleMulterErrors'
import checkForSchool from './checkForSchool'
import checkForSchools from './checkForSchools'

import initializePassport from './passport'
import initializeSocketio from '../socketio/socketio'

initializePassport(passport)

const initializeMiddlewares = (app, server) => {
    initializeSocketio(io(server))
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))
    app.use(passport.initialize())
    app.use(cookieParser())
    app.use(helmet())
    app.use(
        csurf({
            cookie: {
                secure: process.env.NODE_ENV === 'production',
                httpOnly: true,
                sameSite: true
            }
        })
    )
    app.use((req, res, next) => {
        res.cookie('XSRF-TOKEN', req.csrfToken(), {
            secure: process.env.NODE_ENV === 'production',
            sameSite: true
        })
        next()
    })
    app.set('trust proxy', 1)
}

export {
    initializeMiddlewares,
    errorsHandler,
    checkValidationResult,
    rateLimiter,
    authWithJwt,
    multer,
    handleMulterErrors,
    checkForSchool,
    checkForSchools
}
