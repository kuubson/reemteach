import { check } from 'express-validator'
import fs from 'fs'

import { Op, ApiError, detectSanitization, baseUrl } from '@utils'

export default async (req, res, next) => {
    try {
        const { id, content, answerA, answerB, answerC, answerD, properAnswer, image } = req.body
        const [question] = await req.user.getQuestions({
            where: {
                id
            }
        })
        if (!question) {
            throw new ApiError(
                `Wystąpił niespodziewany problem przy aktualizowaniu pytania o id ${id}`,
                409
            )
        }
        if (image === question.image || image === '') {
            const imagePath = `.${question.image.replace(baseUrl(), '')}`
            try {
                if ((req.file && question.image && fs.existsSync(imagePath)) || image === '') {
                    fs.unlinkSync(imagePath)
                }
            } catch (error) {}
            await question.update({
                content,
                answerA,
                answerB,
                answerC,
                answerD,
                properAnswer,
                image: req.file
                    ? process.env.NODE_ENV === 'development'
                        ? `http://localhost:3001/uploads/${req.user.id}/${req.file.filename}`
                        : `https://flirt-app-test.herokuapp.com/uploads/${req.user.id}/${req.file.filename}`
                    : image
            })
            res.send({
                successMessage: `Pomyślnie zaktualizowano pytanie o id ${id}`
            })
        } else {
            throw new ApiError(
                `Wystąpił niespodziewany problem przy aktualizowaniu pytania o id ${id}`,
                409
            )
        }
    } catch (error) {
        next(error)
    }
}

export const validation = () => [
    check('id')
        .trim()
        .notEmpty()
        .bail()
        .isInt()
        .escape(),
    check('content')
        .trim()
        .notEmpty()
        .withMessage('Wprowadź treść pytania!')
        .bail()
        .custom(detectSanitization)
        .withMessage('Treść pytania zawiera niedozwolone znaki!')
        .bail()
        .custom(async (content, { req }) => {
            const [question] = await req.user.getQuestions({
                where: {
                    id: {
                        [Op.ne]: req.body.id
                    },
                    content
                }
            })
            if (question) {
                throw new Error()
            } else {
                return question
            }
        })
        .withMessage('Takie pytanie znajduje się już w Twojej bazie pytań!'),
    check('answerA')
        .trim()
        .notEmpty()
        .withMessage('Wprowadź odpowiedź A!')
        .bail()
        .custom(detectSanitization)
        .withMessage('Odpowiedź A zawiera niedozwolone znaki!'),
    check('answerB')
        .trim()
        .notEmpty()
        .withMessage('Wprowadź odpowiedź B!')
        .bail()
        .custom(detectSanitization)
        .withMessage('Odpowiedź B zawiera niedozwolone znaki!'),
    check('answerC')
        .trim()
        .notEmpty()
        .withMessage('Wprowadź odpowiedź C!')
        .bail()
        .custom(detectSanitization)
        .withMessage('Odpowiedź C zawiera niedozwolone znaki!'),
    check('answerD')
        .trim()
        .notEmpty()
        .withMessage('Wprowadź odpowiedź D!')
        .bail()
        .custom(detectSanitization)
        .withMessage('Odpowiedź D zawiera niedozwolone znaki!'),
    check('properAnswer')
        .trim()
        .notEmpty()
        .withMessage('Wprowadź poprawną odpowiedź!')
        .bail()
        .custom(detectSanitization)
        .withMessage('Poprawna odpowiedź zawiera niedozwolone znaki!')
]
