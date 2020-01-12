const initialState = {
    socket: undefined
}

export default (state = initialState, { payload, type }) => {
    switch (type) {
        case 'setSocket':
            return {
                ...state,
                socket: payload
            }
        default:
            return state
    }
}
