import { combineReducers } from 'redux'
// import { persistReducer } from 'redux-persist'
// import storage from 'redux-persist/lib/storage'

import loader from './loader'
import feedbackHandler from './feedbackHandler'
import socket from './socket'

// const config = {
//     key: 'root',
//     storage
// }

export default combineReducers({
    loader,
    feedbackHandler,
    socket
})
