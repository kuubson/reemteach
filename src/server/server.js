import 'dotenv/config'
import './aliases'

import path from 'path'
import http from 'http'
import express from 'express'

import '@database'

import { initializeMiddlewares } from '@middlewares'
import routes from '@routes'

import errorHandler from '@middlewares/errorHandler'

const app = express()
const server = http.createServer(app)

initializeMiddlewares(app, server)

routes(app)

errorHandler(app)

const buildPath = '../build'

app.use(express.static(path.resolve(__dirname, buildPath)))

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, buildPath, 'index.html'))
})

process.env.NODE_ENV = process.env.NODE_ENV || 'development'

const port = process.env.PORT || 3001

server.listen(port, () => console.log(`The server has been successfully started on port ${port}`))
