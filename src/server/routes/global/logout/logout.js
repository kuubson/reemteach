import { Router } from 'express'

export default Router().get('/api/logout', (req, res) => {
    res.clearCookie('token', {
        // secure: true,
        httpOnly: true,
        sameSite: true
    }).send({
        success: true
    })
})
