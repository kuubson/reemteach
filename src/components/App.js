import React from 'react'
import styled from 'styled-components/macro'
import { hot } from 'react-hot-loader/root'
import { setConfig } from 'react-hot-loader'

setConfig({
    reloadHooks: false
})

const AppContainer = styled.main``

const App = () => {
    return <AppContainer></AppContainer>
}

export default process.env.NODE_ENV === 'development' ? hot(App) : App
