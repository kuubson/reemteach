import { check } from 'express-validator'
import nodemailer from 'nodemailer'
import crypto from 'crypto'

import { Teacher } from '@database'

import { ApiError } from '@utils'

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.NODEMAILER_USERNAME,
        pass: process.env.NODEMAILER_PASSWORD
    }
})

export default async (req, res, next) => {
    try {
        const { name, surname } = req.user
        const { email } = req.body
        const school = await req.user.getSchool()
        const teacher = Teacher.findOne({
            where: {
                email,
                schoolId: school.id
            }
        })
        if (teacher) {
            throw new ApiError(`Nauczyciel z adresem ${email} ma już konto w Twojej szkole!`, 409)
        }
        const password = crypto.randomBytes(20).toString('hex')
        await school.createTeacher({
            email,
            password
        })
        const mailOptions = {
            from: process.env.NODEMAILER_USERNAME,
            to: email,
            subject: `Konto nauczycielskie w aplikacji Reemteach`,
            html: `
                    <h2>Dyrektor ${name} ${surname} utworzył Twoje konto nauczycielskie!</h2>
                    <h3>Zaloguj się, uzupełnij dane personalne i ustaw nowe hasło!</h3>
                    <p>E-mail: ${email}</p>
                    <p>Hasło: ${password}</p>
        		`
        }
        transporter.sendMail(mailOptions, async (error, info) => {
            if (error || !info) {
                throw new ApiError(
                    'Wystąpił niespodziewany problem przy wysyłaniu e-maila z danymi do zalogowania się na konto nauczycielskie!',
                    500
                )
            }
            res.send({
                successMessage: `Na adres ${email} został wysłany e-mail z danymi do zalogowania się na konto nauczycielskie!`
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
