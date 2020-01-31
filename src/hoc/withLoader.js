import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

export default Component => {
    return props => {
        const dispatch = useDispatch()
        const { isLoading } = useSelector(state => state.loader)
        const setIsLoading = payload => dispatch({ type: 'setIsLoading', payload })
        const features = {
            isLoading,
            setIsLoading
        }
        return <Component {...props} {...features} />
    }
}
