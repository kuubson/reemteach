import { combineReducers } from 'redux'
// import { persistReducer } from 'redux-persist'
// import storage from 'redux-persist/lib/storage'

import socket from './socket'
import loader from './loader'
import feedbackHandler from './feedbackHandler'
import menu from './menu'
import confirmationPopup from './confirmationPopup'
import test from './test'

// const config = {
//     key: 'root',
//     storage
// }

export default combineReducers({
    socket,
    loader,
    feedbackHandler,
    menu,
    confirmationPopup,
    test
})
