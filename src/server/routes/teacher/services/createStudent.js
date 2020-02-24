import { check } from 'express-validator'
import nodemailer from 'nodemailer'
import crypto from 'crypto'

import { Student } from '@database'

import { ApiError, detectSanitization } from '@utils'

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
        const { email, school, grade } = req.body
        const [foundSchool] = await req.user.getSchools({
            where: {
                name: school
            }
        })
        const [foundGrade] = await foundSchool.getGrades({
            where: {
                grade
            }
        })
        const schoolGrade =
            foundGrade ||
            (await foundSchool.createGrade({
                grade
            }))
        const student = await Student.findOne({
            where: {
                email
            }
        })
        if (!student) {
            const password = crypto.randomBytes(20).toString('hex')
            await schoolGrade.createStudent({
                email,
                password
            })
            const mailOptions = {
                from: process.env.NODEMAILER_USERNAME,
                to: email,
                subject: `Konto uczniowskie w aplikacji Reemteach`,
                html: `
                    <h2>Nauczyciel ${name} ${surname} utworzył Twoje konto uczniowskie!</h2>
                    <h3>Zostałeś dodany do klasy ${grade} w szkole ${foundSchool.name}!</h3>
                    <h3>Zaloguj się, uzupełnij dane personalne i ustaw nowe hasło!</h3>
                    <p>E-mail: ${email}</p>
                    <p>Hasło: ${password}</p>
        		`
            }
            transporter.sendMail(mailOptions, async (error, info) => {
                if (error || !info) {
                    throw new ApiError(
                        `Wystąpił niespodziewany problem przy wysyłaniu e-maila z danymi do zalogowania się na konto uczniowskie oraz z informacją o dodaniu do klasy ${grade} w szkole ${foundSchool.name}!`,
                        500
                    )
                }
                res.send({
                    successMessage: `Na adres ${email} został wysłany e-mail z danymi do zalogowania się na konto uczniowskie oraz z informacją o dodaniu do klasy ${grade} w szkole ${foundSchool.name}!`
                })
            })
        } else {
            if (await schoolGrade.hasStudent(student)) {
                throw new ApiError(
                    `Uczeń z adresem ${email} znajduje się już w klasie ${grade} w szkole ${foundSchool.name}!`,
                    409
                )
            } else {
                await schoolGrade.addStudent(student)
                const mailOptions = {
                    from: process.env.NODEMAILER_USERNAME,
                    to: email,
                    subject: `Konto uczniowskie w aplikacji Reemteach`,
                    html: `
                    <h2>Nauczyciel ${name} ${surname} dodał Cię do klasy ${grade} w szkole ${foundSchool.name}!</h2>
        		`
                }
                transporter.sendMail(mailOptions, async (error, info) => {
                    if (error || !info) {
                        throw new ApiError(
                            `Wystąpił niespodziewany problem przy wysyłaniu e-maila z informacją o dodaniu do klasy ${grade} w szkole ${foundSchool.name}!`,
                            500
                        )
                    }
                    res.send({
                        successMessage: `Na adres ${email} został wysłany e-mail z informacją o dodaniu do klasy ${grade} w szkole ${foundSchool.name}!`
                    })
                })
            }
        }
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
        .normalizeEmail(),
    check('school')
        .trim()
        .notEmpty()
        .withMessage('Zaznacz szkołę!')
        .bail()
        .custom(detectSanitization)
        .withMessage('Zaznaczona szkoła zawiera niedozwolone znaki!')
        .bail()
        .custom(async (school, { req }) => {
            let schools = await req.user.getSchools()
            schools = schools.map(({ name }) => name)
            if (!schools.includes(school)) {
                throw new Error()
            } else {
                return school
            }
        })
        .withMessage('Zaznacz poprawną szkołę!'),
    check('grade')
        .trim()
        .notEmpty()
        .withMessage('Zaznacz klasę!')
        .bail()
        .custom(detectSanitization)
        .withMessage('Zaznaczona klasa zawiera niedozwolone znaki!')
        .bail()
        .isIn([
            '1A',
            '1B',
            '1C',
            '1D',
            '1E',
            '1F',
            '1G',
            '1H',
            '1I',
            '1J',
            '1K',
            '1L',
            '1M',
            '2A',
            '2B',
            '2C',
            '2D',
            '2E',
            '2F',
            '2G',
            '2H',
            '2I',
            '2J',
            '2K',
            '2L',
            '2M',
            '3A',
            '3B',
            '3C',
            '3D',
            '3E',
            '3F',
            '3G',
            '3H',
            '3I',
            '3J',
            '3K',
            '3L',
            '3M',
            '4A',
            '4B',
            '4C',
            '4D',
            '4E',
            '4F',
            '4G',
            '4H',
            '4I',
            '4J',
            '4K',
            '4L',
            '4M'
        ])
        .withMessage('Zaznacz poprawną klasę!')
]
