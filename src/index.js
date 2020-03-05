import React from 'react'
import ReactDOM from 'react-dom'
import { Router } from 'react-router-dom'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { ThemeProvider } from 'styled-components/macro'
import adapter from 'webrtc-adapter'

import { store, persistor } from '@redux'

import '@styles/fontello/css/fontello.css'
import theme from '@styles/theme'
import 'destyle.css'
import '@styles/index.scss'

import Loader from './components/Loader/Loader'

import App from '@components/App'

import { history } from '@utils'

import * as serviceWorker from './serviceWorker'

ReactDOM.render(
    <Router history={history}>
        <Provider store={store}>
            {/* <PersistGate loading={<Loader />} persistor={persistor}> */}
            <ThemeProvider theme={theme}>
                <App />
            </ThemeProvider>
            {/* </PersistGate> */}
        </Provider>
    </Router>,
    document.getElementById('root')
)

serviceWorker.register()
