import React from 'react'
import styled from 'styled-components/macro'

const RemoveButtonContainer = styled.span`
    margin-left: 20px;
    border-radius: 50%;
    font-weight: 900;
    font-size: 14px;
    cursor: pointer;
`

const RemoveButton = ({ onClick }) => {
    return <RemoveButtonContainer onClick={onClick}>✕</RemoveButtonContainer>
}

export default RemoveButton
