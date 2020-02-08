import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

export default Component => {
    return props => {
        const dispatch = useDispatch()
        const { shouldMenuAppear } = useSelector(state => state.menu)
        const setShouldMenuAppear = payload => dispatch({ type: 'setShouldMenuAppear', payload })
        const features = {
            shouldMenuAppear,
            setShouldMenuAppear
        }
        return <Component {...props} {...features} />
    }
}
