import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { check } from 'express-validator'

import { Student } from '@database'

import { ApiError } from '@utils'

const main = () => async (req, res) => {
    const { email, password } = req.body
    const student = await Student.findOne({
        where: {
            email
        }
    })
    if (!student || !bcrypt.compareSync(password, student.password)) {
        throw new ApiError('Podany adres e-mail lub hasło jest nieprawidłowe!', 400)
    }
    const token = jwt.sign({ email, role: 'student' }, process.env.JWT_KEY)
    res.cookie('token', token, {
        secure: !process.env.NODE_ENV === 'development',
        httpOnly: true,
        sameSite: true
    }).send({
        success: true
    })
}

const validation = () => [
    check('email')
        .not()
        .isEmpty()
        .withMessage('Wprowadź adres e-mail!')
        .bail()
        .isEmail()
        .withMessage('Wprowadź poprawny adres e-mail!')
        .bail()
        .normalizeEmail(),
    check('password')
        .not()
        .isEmpty()
        .withMessage('Wprowadź hasło!')
]

export default () => (validation(), main())
