import React from 'react'
import styled from 'styled-components/macro'

import StyledLecturePopup from '../styled/LecturePopup'

const IconContainer = styled.i`
    color: white;
    font-size: ${({ big }) => (big ? 25 : 20)}px;
`

const Icon = ({ icon, onClick, big }) => {
    return (
        <StyledLecturePopup.IconContainer onClick={onClick} big={big}>
            <IconContainer className={icon} big={big} />
        </StyledLecturePopup.IconContainer>
    )
}

export default Icon
