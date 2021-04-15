import { store } from 'redux/store'

export default (message, buttonText, callback) =>
    store.dispatch({
        type: 'setFeedbackData',
        payload: {
            message,
            buttonText,
            callback
        }
    })
