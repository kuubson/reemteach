import axios from 'axios'

import { setIsLoading, handleApiError } from '@utils'

const delayedApiAxios = axios.create()

let timeoutId

delayedApiAxios.interceptors.request.use(
    request => {
        if (!timeoutId) {
            timeoutId = setTimeout(() => {
                setIsLoading(true)
            }, 1000)
        }
        return request
    },
    error => {
        setIsLoading(false)
        clearTimeout(timeoutId)
        timeoutId = undefined
        handleApiError(error)
        throw error
    }
)

delayedApiAxios.interceptors.response.use(
    response => {
        setIsLoading(false)
        clearTimeout(timeoutId)
        timeoutId = undefined
        return response
    },
    error => {
        setIsLoading(false)
        clearTimeout(timeoutId)
        timeoutId = undefined
        handleApiError(error)
        throw error
    }
)

export default delayedApiAxios
