import { check } from 'express-validator'

import { detectSanitization } from '@utils'

export default async (req, res, next) => {
    try {
        const { email, school, grade } = req.body
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
