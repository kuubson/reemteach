import React from 'react'
import ReactDOM from 'react-dom'
import { Router } from 'react-router-dom'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { ThemeProvider } from 'styled-components/macro'
import adapter from 'webrtc-adapter'

import { store, persistor } from 'redux/store'

import 'leaflet/dist/leaflet.css'
import 'assets/styles/fontello/css/fontello.css'
import theme from 'assets/styles/theme'
import 'destyle.css'
import 'assets/styles/index.scss'

import Loader from './components/Loader/Loader'

import App from 'components/App'

import { history } from 'utils'

import * as serviceWorker from './serviceWorker'

ReactDOM.render(
    <Router history={history}>
        <Provider store={store}>
            <PersistGate loading={<Loader />} persistor={persistor}>
                <ThemeProvider theme={theme}>
                    <App />
                </ThemeProvider>
            </PersistGate>
        </Provider>
    </Router>,
    document.getElementById('root')
)

serviceWorker.register({
    onUpdate: async registration => {
        await registration.unregister()
        window.location.reload(true)
    }
})
