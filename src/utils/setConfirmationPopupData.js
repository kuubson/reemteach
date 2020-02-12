import { store } from '@redux'

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
