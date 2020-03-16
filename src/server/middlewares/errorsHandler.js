export default app => {
    app.use((error, _, res, __) => {
        console.log(error)
        if (error.code === 'EBADCSRFTOKEN') {
            const status = 403
            res.clearCookie('token', {
                secure: process.env.NODE_ENV === 'production',
                httpOnly: true,
                sameSite: true
            })
                .status(status)
                .send({
                    status
                })
        } else {
            const status = error.status || 500
            const errorMessage =
                error.errorMessage ||
                'Serwer nie jest w stanie tymczasowo przetworzyć Twojego żądania!'
            res.status(status).send({
                status,
                errorMessage
            })
        }
    })
}
