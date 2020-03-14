import React from 'react'
import styled from 'styled-components/macro'

const RemoveButtonContainer = styled.span`
    font-weight: 900;
    font-size: 14px;
    cursor: pointer;
    margin-left: 20px;
    color: ${({ orange }) => (orange ? 'orange' : 'green')};
    opacity: ${({ visible }) => (visible ? 1 : 0)};
    margin-top: 15px;
    border-radius: 50%;
`

const RemoveButton = ({ onClick, visible, orange }) => {
    return (
        <RemoveButtonContainer onClick={onClick} visible={visible} orange={orange}>
            ✕
        </RemoveButtonContainer>
    )
}

export default RemoveButton
