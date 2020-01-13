import axios from 'axios'

import { handleApiError, setIsLoading } from '@utils'

const apiAxios = axios.create({
    baseURL: process.env.API_ROOT
})

apiAxios.interceptors.request.use(
    request => {
        setIsLoading(true)
        return request
    },
    error => {
        setIsLoading(false)
        handleApiError(error)
        throw error
    }
)
apiAxios.interceptors.response.use(
    response => {
        setIsLoading(false)
        return response
    },
    error => {
        setIsLoading(false)
        handleApiError(error)
        throw error
    }
)

export default apiAxios
