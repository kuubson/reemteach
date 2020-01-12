import { setFeedbackData, redirectTo } from '@utils'

export default error => {
	console.log(error)
	if (error.response) {
		const { status, errorMessage, rejectedRole } = error.response.data
		if (status === 401) {
			setFeedbackData(errorMessage, 'Zaloguj się ponownie', () => {
				redirectTo('/', {
					shouldBossFormsFlip: rejectedRole === 'boss',
					shouldWorkerFormAppear: rejectedRole === 'worker'
				})
			})
		} else {
			if (errorMessage) {
				setFeedbackData(errorMessage, 'Ok', () => {})
			} else {
				setFeedbackData(
					'Nie można nawiązać połączenia z serwerem lub wystąpił niespodziewany problem po jego stronie!',
					'Odśwież aplikację',
					() => {
						window.location.reload()
					}
				)
			}
		}
	} else if (error.request) {
		setFeedbackData(
			'Serwer nie jest w stanie tymczasowo przetworzyć Twojego żądania!',
			'Odśwież aplikację',
			() => {
				window.location.reload()
			}
		)
	} else {
		setFeedbackData(
			'Wystąpił niespodziewany problem po stronie klienta!',
			'Odśwież aplikację',
			() => {
				window.location.reload()
			}
		)
	}
}
