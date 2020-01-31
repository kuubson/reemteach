import { createStore } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import { persistStore } from 'redux-persist'

import reducers from './reducers'

export const store =
    process.env.NODE_ENV === 'development'
        ? createStore(reducers, composeWithDevTools())
        : createStore(reducers)
export const persistor = persistStore(store)
