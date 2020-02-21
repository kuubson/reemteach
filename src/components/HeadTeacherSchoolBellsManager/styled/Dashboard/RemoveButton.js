import React from 'react'
import styled from 'styled-components/macro'

const RemoveButtonContainer = styled.span`
    margin-left: 10px;
    font-weight: 900;
    font-size: 14px;
    cursor: pointer;
    margin-left: 20px;
    color: ${({ withRecess }) => (withRecess ? 'orange' : 'green')};
    opacity: ${({ visible }) => (visible ? 1 : 0)};
    margin-top: 15px;
    border-radius: 50%;
`

const RemoveButton = ({ onClick, visible, withRecess }) => {
    return (
        <RemoveButtonContainer onClick={onClick} visible={visible} withRecess={withRecess}>
            ✕
        </RemoveButtonContainer>
    )
}

export default RemoveButton
