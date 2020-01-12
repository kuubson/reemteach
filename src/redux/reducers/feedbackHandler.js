const initialState = {
    shouldFeedbackHandlerAppear: false,
    feedbackHandlerData: {
        message: '',
        buttonText: '',
        callback: undefined
    }
}

export default (state = initialState, { payload, type }) => {
    switch (type) {
        case 'setShouldFeedbackHandlerAppear':
            return {
                ...state,
                shouldFeedbackHandlerAppear: payload
            }
        case 'setFeedbackData':
            return {
                ...state,
                shouldFeedbackHandlerAppear: true,
                feedbackHandlerData: payload
            }
        default:
            return state
    }
}
