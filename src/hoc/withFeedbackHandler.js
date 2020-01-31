import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

export default Component => {
    return props => {
        const dispatch = useDispatch()
        const { shouldFeedbackHandlerAppear, feedbackHandlerData } = useSelector(
            state => state.feedbackHandler
        )
        const setShouldFeedbackHandlerAppear = payload =>
            dispatch({ type: 'setShouldFeedbackHandlerAppear', payload })
        const setFeedbackData = (message, buttonText, callback) =>
            dispatch({
                type: 'setFeedbackData',
                payload: {
                    message,
                    buttonText,
                    callback
                }
            })
        const features = {
            shouldFeedbackHandlerAppear,
            feedbackHandlerData,
            setShouldFeedbackHandlerAppear,
            setFeedbackData
        }
        return <Component {...props} {...features} />
    }
}
