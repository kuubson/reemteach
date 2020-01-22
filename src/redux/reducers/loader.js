const initialState = {
    isLoading: false
}

export default (state = initialState, { payload, type }) => {
    switch (type) {
        case 'setIsLoading':
            return {
                ...state,
                isLoading: payload
            }
        default:
            return state
    }
}
