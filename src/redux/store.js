import { createStore } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import { persistStore } from 'redux-persist'

import reducers from './reducers'

export const store = createStore(reducers, composeWithDevTools())
export const persistor = persistStore(store)
