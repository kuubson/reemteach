import { store } from '@redux'

export default (message, buttonText, callback) =>
    store.dispatch({
        type: 'setFeedbackData',
        payload: {
            message,
            buttonText,
            callback
        }
    })
