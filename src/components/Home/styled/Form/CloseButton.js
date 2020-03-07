import React from 'react'
import styled from 'styled-components/macro'

const CloseButtonContainer = styled.button`
    color: ${({ black }) => (black ? 'black' : 'white')};
    font-size: 19px;
    cursor: pointer;
    position: absolute;
    top: 20px;
    right: 20px;
    z-index: 2;
    @media (max-width: 500px) {
        font-size: 18px;
    }
`

const CloseButton = ({ onClick, black }) => {
    return (
        <CloseButtonContainer onClick={onClick} black={black}>
            ✕
        </CloseButtonContainer>
    )
}

export default CloseButton
