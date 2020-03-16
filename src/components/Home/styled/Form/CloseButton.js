import React from 'react'
import styled, { css } from 'styled-components/macro'

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
    ${({ withBoxShadow }) => {
        if (withBoxShadow)
            return css`
                filter: drop-shadow(0px 0px 1px black);
            `
    }}
`

const CloseButton = ({ onClick, black, withBoxShadow }) => {
    return (
        <CloseButtonContainer onClick={onClick} black={black} withBoxShadow={withBoxShadow}>
            ✕
        </CloseButtonContainer>
    )
}

export default CloseButton
