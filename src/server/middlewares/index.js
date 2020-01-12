const express = require('express')
const cookieParser = require('cookie-parser')
const helmet = require('helmet')
const passport = require('passport')
const io = require('socket.io')
const csurf = require('csurf')

require('./passport')(passport)

const checkValidationResult = require('./checkValidationResult')
const rateLimiter = require('./rateLimiter')
const authWithJwt = require('./authWithJwt')

module.exports = {
    main: (app, server) => {
        require('../socket.io/socket.io')(io(server))
        app.use(express.json())
        app.use(express.urlencoded({ extended: true }))
        app.use(passport.initialize())
        app.use(cookieParser())
        app.use(helmet())
        app.use(
            csurf({
                cookie: {
                    // secure: true,
                    httpOnly: true,
                    sameSite: true
                }
            })
        )
        app.use((req, res, next) => {
            res.cookie('XSRF-TOKEN', req.csrfToken(), {
                // secure: true,
                sameSite: true
            })
            next()
        })
        app.set('trust proxy', 1)
    },
    checkValidationResult,
    rateLimiter,
    authWithJwt
}
