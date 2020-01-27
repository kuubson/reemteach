import { Router } from 'express'

export default Router().get('/api/logout', (req, res) => {
    res.clearCookie('token', {
        secure: process.env.NODE_ENV === 'development' ? false : true,
        httpOnly: true,
        sameSite: true
    }).send({
        success: true
    })
})
