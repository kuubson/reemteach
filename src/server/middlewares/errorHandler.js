module.exports = app => {
	app.use((error, req, res, next) => {
		console.log(error)
		if (error.code === 'EBADCSRFTOKEN') {
			const status = 403
			res.clearCookie('token', {
				// secure: true,
				httpOnly: true,
				sameSite: true
			})
				.status(status)
				.send({
					status,
					errorMessage: 'Serwer wykrył niepożądane działanie z Twojej strony!'
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
