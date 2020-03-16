import 'dotenv/config'
import './aliases'

import path from 'path'
import http from 'http'
import express from 'express'

import '@database'

import { initializeMiddlewares, errorsHandler } from '@middlewares'

import routes from '@routes'

const app = express()
const server = http.createServer(app)

initializeMiddlewares(app, server)

routes(app)

errorsHandler(app)

const developmentMode = (process.env.NODE_ENV = process.env.NODE_ENV || 'development')

const buildPath = developmentMode ? '../../build' : '../build'
const uploadsPath = developmentMode ? '../../uploads' : '../uploads'

app.use('/uploads', express.static(path.resolve(__dirname, uploadsPath)))

app.use(express.static(path.resolve(__dirname, buildPath)))

app.get('*', (_, res) => {
    res.sendFile(path.resolve(__dirname, buildPath, 'index.html'))
})

const port = process.env.PORT || 3001

server.listen(port, () => console.log(`The server has been successfully started on port ${port}!`))
