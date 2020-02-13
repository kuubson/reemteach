import { check } from 'express-validator'
import nodemailer from 'nodemailer'
import crypto from 'crypto'

import { HeadTeacher } from '@database'

import { ApiError } from '@utils'

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.NODEMAILER_USERNAME,
        pass: process.env.NODEMAILER_PASSWORD
    }
})

transporter.verify((error, success) => {
    if (error) {
        console.log({
            error,
            message: 'There was a problem connecting to the Gmail!'
        })
    }
    if (success) {
        console.log('The connection with Gmail has been successfully established!')
    }
})

export default async (req, res, next) => {
    try {
        const { email } = req.body
        const headTeacher = await HeadTeacher.findOne({
            where: {
                email
            }
        })
        if (headTeacher) {
            throw new ApiError(`Dyrektor z adresem ${email} znajduje się już w systemie!`, 409)
        }
        const password = crypto.randomBytes(20).toString('hex')
        await HeadTeacher.create({
            email,
            password
        })
        const mailOptions = {
            from: process.env.NODEMAILER_USERNAME,
            to: email,
            subject: `Konto dyrektorskie w aplikacji Reemteach`,
            html: `
                    <h2>Administrator utworzył Twoje konto dyrektorskie!</h2>
                    <h3>Zaloguj się, uzupełnij dane personalne, ustaw nowe hasło i utwórz szkołę!</h3>
                    <p>E-mail: ${email}</p>
                    <p>Hasło: ${password}</p>
        		`
        }
        transporter.sendMail(mailOptions, async (error, info) => {
            if (error || !info) {
                throw new ApiError(
                    'Wystąpił niespodziewany problem przy wysyłaniu e-maila z danymi do zalogowania się na konto dyrektorskie!',
                    500
                )
            }
            res.send({
                successMessage: `Na adres ${email} został wysłany e-mail z danymi do zalogowania się na konto dyrektorskie!`
            })
        })
    } catch (error) {
        next(error)
    }
}

export const validation = () => [
    check('email')
        .trim()
        .notEmpty()
        .withMessage('Wprowadź adres e-mail!')
        .bail()
        .isEmail()
        .withMessage('Wprowadź poprawny adres e-mail!')
        .normalizeEmail()
]
