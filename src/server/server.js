require('dotenv').config()
require('module-alias/register')

const errorHandler = require('@middlewares/errorHandler')
const buildPath = '../../build'

const path = require('path')
const http = require('http')
const express = require('express')
const app = express()
const server = http.createServer(app)

require('@database')
require('@middlewares').main(app, server)
require('@routes')(app)

errorHandler(app)

app.use(express.static(path.resolve(__dirname, buildPath)))

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, buildPath, 'index.html'))
})

const port = process.env.PORT || 3001

server.listen(port, () =>
    console.log(`The server has been successfully started on port ${port}`)
)
