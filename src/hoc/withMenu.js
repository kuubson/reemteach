import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

export default Component => {
    return props => {
        const dispatch = useDispatch()
        const { shouldMenuAppear } = useSelector(state => state.menu)
        const setShouldMenuAppear = payload => dispatch({ type: 'setShouldMenuAppear', payload })
        const closeMenuOnClick = callback => {
            if (window.innerWidth <= 500) {
                setShouldMenuAppear(false)
                setTimeout(() => {
                    setShouldMenuAppear()
                    callback()
                }, 800)
            } else {
                callback()
            }
        }
        const features = {
            shouldMenuAppear,
            setShouldMenuAppear,
            closeMenuOnClick
        }
        return <Component {...props} {...features} />
    }
}
