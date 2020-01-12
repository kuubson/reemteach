import { store } from '@redux'

export default isLoading => {
    store.dispatch({
        type: 'setIsLoading',
        payload: isLoading
    })
}
