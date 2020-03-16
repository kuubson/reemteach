import { check } from 'express-validator'
import fs from 'fs'

import { ApiError, baseUrl } from '@utils'

export default async (req, res, next) => {
    try {
        const { id } = req.body
        const [question] = await req.user.getQuestions({
            where: {
                id
            }
        })
        if (!question) {
            throw new ApiError(
                `Wystąpił niespodziewany problem przy usuwaniu pytania o id ${id}`,
                409
            )
        }
        const imagePath = `.${question.image.replace(baseUrl(), '')}`
        try {
            if (question.image && fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath)
            }
        } catch (error) {}
        await question.destroy()
        res.send({
            successMessage: `Pomyślnie usunięto pytanie o id ${id}!`
        })
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
        .escape()
]
