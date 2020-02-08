import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { check } from 'express-validator'

import { Admin } from '@database'

import { ApiError } from '@utils'

export default async (req, res, next) => {
    try {
        const { email, password } = req.body
        const admin = await Admin.findOne({
            where: {
                email
            }
        })
        if (!admin || !bcrypt.compareSync(password, admin.password)) {
            throw new ApiError('Podany adres e-mail lub hasło jest nieprawidłowe!', 400)
        }
        const token = jwt.sign({ email, role: 'admin' }, process.env.JWT_KEY)
        res.cookie('token', token, {
            secure: !process.env.NODE_ENV === 'development',
            httpOnly: true,
            sameSite: true
        }).send({
            success: true
        })
    } catch (error) {
        next(error)
    }
}

export const validation = () => [
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
