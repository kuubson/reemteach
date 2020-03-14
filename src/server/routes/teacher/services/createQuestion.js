import { check } from 'express-validator'

import { detectSanitization } from '@utils'

export default async (req, res, next) => {
    try {
        const { subject, content, answerA, answerB, answerC, answerD, properAnswer } = req.body
        await req.user.createQuestion({
            subject,
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
                : ''
        })
        res.send({
            successMessage: 'Pomyślnie utworzono pytanie!'
        })
    } catch (error) {
        next(error)
    }
}

export const validation = () => [
    check('subject')
        .trim()
        .notEmpty()
        .withMessage('Zaznacz przedmiot pytania!')
        .bail()
        .custom(detectSanitization)
        .withMessage('Przedmiot pytania zawiera niedozwolone znaki!')
        .bail()
        .isIn([
            'Religia',
            'Język polski',
            'Język angielski',
            'Język niemiecki',
            'Język rosyjski',
            'Język francuski',
            'Matematyka',
            'Fizyka',
            'Biologia',
            'Chemia',
            'Geografia',
            'Wiedza o społeczeństwie',
            'Historia',
            'Informatyka'
        ])
        .withMessage('Zaznacz poprawny przedmiot pytania!'),
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
