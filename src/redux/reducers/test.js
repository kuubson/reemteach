const initialState = {
    test: []
}

export default (state = initialState, { payload, type }) => {
    switch (type) {
        case 'setTest':
            return {
                ...state,
                test: payload
            }
        default:
            return state
    }
}
