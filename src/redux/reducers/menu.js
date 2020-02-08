const initialState = {
    shouldMenuAppear: undefined
}

export default (state = initialState, { payload, type }) => {
    switch (type) {
        case 'setShouldMenuAppear':
            return {
                ...state,
                shouldMenuAppear: payload
            }
        default:
            return state
    }
}
