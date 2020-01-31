import { store } from '@redux'

export default payload => {
    store.dispatch({
        type: 'setShouldFeedbackHandlerAppear',
        payload
    })
}
