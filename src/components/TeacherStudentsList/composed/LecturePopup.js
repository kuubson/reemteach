import React, { useEffect, useState, useRef } from 'react'
import styled, { css } from 'styled-components/macro'

import HForm from '@components/Home/styled/Form'
import StyledLecturePopup from '../styled/LecturePopup'

import Composed from '../composed'

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

const LecturePopup = ({ stream, students, onClick, shouldSlideIn }) => {
    const videoRef = useRef()
    const [isMuted, setIsMuted] = useState(false)
    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.srcObject = stream
        }
    }, [stream])
    return (
        <LecturePopupContainer shouldSlideIn={shouldSlideIn}>
            <HForm.CloseButton onClick={onClick} black />
            <StyledLecturePopup.VideoContainer>
                <StyledLecturePopup.Video ref={videoRef} muted autoPlay />
                <StyledLecturePopup.IconsContainer>
                    <Composed.Icon icon="icon-desktop" />
                    <Composed.Icon icon="icon-cancel-circled" big />
                </StyledLecturePopup.IconsContainer>
            </StyledLecturePopup.VideoContainer>
            <StyledLecturePopup.VideoContainer>
                <StyledLecturePopup.Video id="student" muted={isMuted} autoPlay />
                <StyledLecturePopup.IconsContainer>
                    <Composed.Icon icon="icon-cancel-circled" big />
                    <Composed.Icon
                        icon={isMuted ? 'icon-mute' : 'icon-mic'}
                        onClick={() => setIsMuted(isMuted => !isMuted)}
                    />
                </StyledLecturePopup.IconsContainer>
            </StyledLecturePopup.VideoContainer>
        </LecturePopupContainer>
    )
}

export default LecturePopup
