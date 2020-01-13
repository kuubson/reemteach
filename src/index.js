import React from 'react'
import ReactDOM from 'react-dom'
import { Router } from 'react-router-dom'

import 'destyle.css'
import '@styles/index.scss'

import App from './components/App'

import { serviceWorker, history } from '@utils'

ReactDOM.render(
    <Router history={history}>
        <App />
    </Router>,
    document.getElementById('root')
)

serviceWorker.unregister()
