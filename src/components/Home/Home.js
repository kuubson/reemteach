import React from 'react'
import styled from 'styled-components/macro'

import Dashboard from './styled/Dashboard'

const HomeContainer = styled.section`
    width: 100%;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
`

const Home = () => {
    return (
        <HomeContainer>
            <Dashboard.Header>Witaj w aplikacji Reemteach</Dashboard.Header>
        </HomeContainer>
    )
}

export default Home
