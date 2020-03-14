import multer from 'multer'
import fs from 'fs'
import crypto from 'crypto'

const storage = multer.diskStorage({
    destination: (req, _, callback) => {
        if (!fs.existsSync('./uploads')) {
            fs.mkdirSync('./uploads')
        }
        const directory = `./uploads/${req.user.id}`
        if (!fs.existsSync(directory)) {
            fs.mkdirSync(directory)
        }
        return callback(null, directory)
    },
    filename: (req, _, callback) => {
        callback(null, `User-${req.user.id}-Image-${crypto.randomBytes(20).toString('hex')}.png`)
    }
})

export default multer({
    storage,
    fileFilter: (req, { mimetype, originalname }, callback) => {
        const allowedExtenstions = /gif|jpe?g|tiff|png|webp|bmp/
        if (!allowedExtenstions.test(mimetype) || !allowedExtenstions.test(originalname)) {
            req.allowedExtenstionsError = true
            return callback(null, false)
        }
        return callback(null, true)
    },
    limits: {
        fileSize: 2097152
    }
})
