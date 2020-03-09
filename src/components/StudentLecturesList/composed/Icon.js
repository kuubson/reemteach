import React from 'react'
import styled from 'styled-components/macro'

import StyledLecturePopup from '../styled/LecturePopup'

const IconContainer = styled.i`
    color: #f24b4b;
    font-size: 20px;
    @media (max-width: 1250px) {
        font-size: 16px;
    }
`

const Icon = ({ icon, onClick }) => {
    return (
        <StyledLecturePopup.IconContainer onClick={onClick}>
            <IconContainer className={icon} />
        </StyledLecturePopup.IconContainer>
    )
}

export default Icon
