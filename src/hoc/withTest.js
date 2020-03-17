import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

export default Component => {
    return props => {
        const dispatch = useDispatch()
        const { test } = useSelector(state => state.test)
        const setTest = payload => dispatch({ type: 'setTest', payload })
        const features = {
            test,
            setTest
        }
        return <Component {...props} {...features} />
    }
}
