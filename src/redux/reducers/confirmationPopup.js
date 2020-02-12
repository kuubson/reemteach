const initialState = {
    shouldConfirmationPopupAppear: false,
    confirmationPopupData: {
        message: '',
        confirmationButtonText: '',
        rejectionButtonText: '',
        callback: undefined
    }
}

export default (state = initialState, { payload, type }) => {
    switch (type) {
        case 'setShouldConfirmationPopupAppear':
            return {
                ...state,
                shouldConfirmationPopupAppear: payload
            }
        case 'setConfirmationPopupData':
            return {
                ...state,
                shouldConfirmationPopupAppear: true,
                confirmationPopupData: payload
            }
        default:
            return state
    }
}
