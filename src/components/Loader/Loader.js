import React from 'react'
import styled from 'styled-components/macro'
import Spinner from 'react-spinkit'

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
    z-index: 4;
    @media (max-width: 500px) {
        div {
            transform: scale(0.85);
        }
    }
`

const Loader = () => {
    return (
        <LoaderContainer>
            <Spinner name="ball-spin-fade-loader" fadeIn="none" color="white" />
        </LoaderContainer>
    )
}

export default Loader
