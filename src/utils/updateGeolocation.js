import axios from 'axios'

import { setIsLoading, setFeedbackData, handleApiError } from '@utils'

const handleGeolocation = role =>
    navigator.geolocation.getCurrentPosition(
        async ({ coords: { latitude, longitude } }) => {
            try {
                setIsLoading(true)
                const url = `/api/${role}/updateGeolocation`
                const response = await axios.post(url, {
                    latitude,
                    longitude
                })
                if (response) {
                    setIsLoading(false)
                }
            } catch (error) {
                handleApiError(error)
            }
        },
        () => {
            setIsLoading(false)
            setFeedbackData(
                'Wystąpił niespodziewany problem przy udostępnianiu lokalizacji!',
                'Odśwież aplikację',
                () => window.location.reload()
            )
        }
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
        setFeedbackData(
            'Wystąpił niespodziewany problem przy udostępnianiu lokalizacji!',
            'Odśwież aplikację',
            () => window.location.reload()
        )
    }
}
