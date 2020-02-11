import fs from 'fs'
import path from 'path'

fs.readdirSync(__dirname)
    .filter(file => file !== 'index.js')
    .forEach(
        file => (module.exports[file.replace('.js', '')] = require(path.resolve(__dirname, file)))
    )
