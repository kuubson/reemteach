import { setFeedbackData, delayedRedirectTo } from '@utils'

const reloadWindow = () => window.location.reload()

export default error => {
    console.log(error)
    if (error.response) {
        const { status, errorMessage } = error.response.data
        if (status === 401) {
            setFeedbackData(errorMessage, 'Zaloguj się ponownie', () => delayedRedirectTo('/'))
        } else {
            if (errorMessage) {
                setFeedbackData(errorMessage, 'Ok')
            } else {
                setFeedbackData(
                    'Nie można nawiązać połączenia z serwerem lub wystąpił niespodziewany problem po jego stronie!',
                    'Odśwież aplikację',
                    reloadWindow
                )
            }
        }
    } else if (error.request) {
        setFeedbackData(
            'Serwer nie jest w stanie tymczasowo przetworzyć Twojego żądania!',
            'Odśwież aplikację',
            reloadWindow
        )
    } else {
        setFeedbackData(
            'Wystąpił niespodziewany problem w Twojej przeglądarce!',
            'Odśwież aplikację',
            reloadWindow
        )
    }
}
