import React from 'react'
import styled from 'styled-components/macro'

const RemoveButtonContainer = styled.span`
    margin-left: 20px;
    border-radius: 50%;
    font-weight: 900;
    font-size: 14px;
    cursor: pointer;
    position: absolute;
    z-index: 1;
    top: 50%;
    right: 15px;
    transform: translate(0px, -50%);
    @media (max-width: 500px) {
        font-size: 11px;
    }
`

const RemoveButton = ({ onClick }) => {
    return <RemoveButtonContainer onClick={onClick}>✕</RemoveButtonContainer>
}

export default RemoveButton
