import { delayedApiAxios, setShouldFeedbackHandlerAppear, setFeedbackData } from '@utils'

const handleGeolocation = role =>
    navigator.geolocation.getCurrentPosition(
        async ({ coords: { latitude, longitude } }) => {
            const url = `/api/${role}/updateGeolocation`
            const response = await delayedApiAxios.post(url, {
                latitude,
                longitude
            })
            if (response) {
                setShouldFeedbackHandlerAppear(false)
            }
        },
        () => setFeedbackData('Wystąpił niespodziewany problem przy udostępnianiu lokalizacji!')
    )

export default async role => {
    try {
        const { permissions, geolocation } = navigator
        if (!permissions || !geolocation) {
            return setFeedbackData(
                'Twoja przeglądarka nie wspiera geolokalizacji! Do poprawnego działania aplikacji jest ona wymagana!'
            )
        }
        const { state } = await permissions.query({ name: 'geolocation' })
        switch (state) {
            case 'granted':
                handleGeolocation(role)
                break
            case 'prompt':
                setFeedbackData(
                    'Aplikacja wymaga zgody na dostęp do lokalizacji!',
                    'Udostępnij',
                    () => handleGeolocation(role)
                )
                break
            default:
                setFeedbackData(
                    'Aplikacja wymaga zgody na dostęp do lokalizacji! Udostępnij ją w ustawieniach przeglądarki!'
                )
        }
    } catch (error) {
        setFeedbackData('Wystąpił niespodziewany problem przy udostępnianiu lokalizacji!')
    }
}
