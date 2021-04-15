import { store } from 'redux/store'

export default (message, confirmationButtonText, rejectionButtonText, callback) =>
    store.dispatch({
        type: 'setConfirmationPopupData',
        payload: {
            message,
            confirmationButtonText,
            rejectionButtonText,
            callback
        }
    })
