import 'dotenv/config'
import './aliases'

import path from 'path'
import http from 'http'
import express from 'express'

// import '@database'

import middlewares from '@middlewares'
import routes from '@routes'

import errorHandler from '@middlewares/errorHandler'

const app = express()
const server = http.createServer(app)

middlewares.main(app, server)

routes(app)

errorHandler(app)

app.use(express.static(path.resolve(__dirname, '../build')))

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../build', 'index.html'))
})

const port = process.env.PORT || 3001

server.listen(port, () =>
    console.log(`The server has been successfully started on port ${port}`)
)
