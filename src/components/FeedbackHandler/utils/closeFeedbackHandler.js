import { store } from '@redux'

export default ({ callback }) => {
    typeof callback === 'function' && callback()
    store.dispatch({
        type: 'setShouldFeedbackHandlerAppear',
        payload: false
    })
}
