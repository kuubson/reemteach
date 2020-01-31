import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

export default Component => {
    return props => {
        const dispatch = useDispatch()
        const { socket } = useSelector(state => state.socket)
        const setSocket = payload => dispatch({ type: 'setSocket', payload })
        const features = {
            socket,
            setSocket
        }
        return <Component {...props} {...features} />
    }
}
