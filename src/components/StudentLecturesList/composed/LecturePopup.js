import React, { useState } from 'react'
import styled, { css } from 'styled-components/macro'

import HForm from '@components/Home/styled/Form'
import TSLStyledLecturePopup from '@components/TeacherStudentsList/styled/LecturePopup'

import TSLComposed from '@components/TeacherStudentsList/composed'

const LecturePopupContainer = styled.div`
    width: 100%;
    height: 100vh;
    background: #f24b4b;
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    top: 100%;
    left: 50%;
    transform: translate(-50%, 0%);
    transition: transform 0.7s ease-in-out, top 0.7s ease-in-out;
    z-index: 1;
    ${({ shouldSlideIn }) => {
        if (shouldSlideIn)
            return css`
                top: 50%;
                transform: translate(-50%, calc(-50% - 1px));
            `
    }}
`

const LecturePopup = ({ onClick, shouldSlideIn }) => {
    const [isMuted, setIsMuted] = useState(true)
    return (
        <LecturePopupContainer shouldSlideIn={shouldSlideIn}>
            <HForm.CloseButton onClick={onClick} black />
            <TSLStyledLecturePopup.VideoContainer>
                <TSLStyledLecturePopup.Video id="student" muted autoPlay />
                <TSLStyledLecturePopup.IconsContainer>
                    <TSLComposed.Icon icon="icon-desktop" />
                    <TSLComposed.Icon icon="icon-cancel-circled" big />
                </TSLStyledLecturePopup.IconsContainer>
            </TSLStyledLecturePopup.VideoContainer>
            <TSLStyledLecturePopup.VideoContainer>
                <TSLStyledLecturePopup.Video id="teacher" muted={isMuted} autoPlay />
                <TSLStyledLecturePopup.IconsContainer>
                    <TSLComposed.Icon icon="icon-cancel-circled" big />
                    <TSLComposed.Icon
                        icon={isMuted ? 'icon-mute' : 'icon-mic'}
                        onClick={() => setIsMuted(isMuted => !isMuted)}
                    />
                </TSLStyledLecturePopup.IconsContainer>
            </TSLStyledLecturePopup.VideoContainer>
        </LecturePopupContainer>
    )
}

export default LecturePopup
