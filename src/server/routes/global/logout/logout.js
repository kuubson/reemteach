import { Router } from 'express'

export default Router().get('/api/logout', (req, res) => {
    res.clearCookie('token', {
        secure: !process.env.NODE_ENV === 'development',
        httpOnly: true,
        sameSite: true
    }).send({
        success: true
    })
})
