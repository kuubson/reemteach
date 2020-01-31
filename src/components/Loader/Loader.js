import React from 'react'
import styled from 'styled-components/macro'
import Spinner from 'react-spinkit'

import Dashboard from './styled/Dashboard'

const LoaderContainer = styled.div`
    width: 100%;
    height: 100vh;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    top: 0px;
    left: 0px;
    z-index: 2;
`

const Loader = () => {
    return (
        <LoaderContainer>
            <Dashboard.SpinnerContainer>
                <Spinner name="ball-spin-fade-loader" fadeIn="none" color="white" />
            </Dashboard.SpinnerContainer>
        </LoaderContainer>
    )
}

export default Loader
