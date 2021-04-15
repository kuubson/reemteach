import { store } from 'redux/store'

export default payload =>
    store.dispatch({
        type: 'setShouldMenuAppear',
        payload
    })
