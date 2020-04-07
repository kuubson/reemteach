import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

export default Component => {
    return props => {
        const dispatch = useDispatch()
        const { shouldConfirmationPopupAppear, confirmationPopupData } = useSelector(
            state => state.confirmationPopup
        )
        const setShouldConfirmationPopupAppear = payload =>
            dispatch({ type: 'setShouldConfirmationPopupAppear', payload })
        const setConfirmationPopupData = (
            message,
            confirmationButtonText,
            rejectionButtonText,
            callback
        ) =>
            dispatch({
                type: 'setConfirmationPopupData',
                payload: {
                    message,
                    confirmationButtonText,
                    rejectionButtonText,
                    callback
                }
            })
        const features = {
            shouldConfirmationPopupAppear,
            confirmationPopupData,
            setShouldConfirmationPopupAppear,
            setConfirmationPopupData
        }
        return <Component {...props} {...features} />
    }
}
