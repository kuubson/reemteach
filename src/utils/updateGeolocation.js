import axios from 'axios'

import { setIsLoading, handleApiError } from 'utils'

export default async role => {
    navigator.geolocation.getCurrentPosition(async ({ coords: { latitude, longitude } }) => {
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
    })
}
