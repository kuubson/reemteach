import React from 'react'
import styled from 'styled-components/macro'

const CloseButtonContainer = styled.button`
    color: white;
    font-size: 19px;
    cursor: pointer;
    position: absolute;
    top: 20px;
    right: 20px;
    @media (max-width: 500px) {
        font-size: 18px;
    }
`

const CloseButton = ({ onClick }) => {
    return <CloseButtonContainer onClick={onClick}>✕</CloseButtonContainer>
}

export default CloseButton
