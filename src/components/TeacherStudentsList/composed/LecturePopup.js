import React, { useEffect, useState, useRef } from 'react'
import styled, { css } from 'styled-components/macro'

import AHTLDashboard from '@components/AdminHeadTeachersList/styled/Dashboard'
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

const LecturePopup = ({ stream, onClick, shouldSlideIn }) => {
    const [isMuted, setIsMuted] = useState()
    const videoRef = useRef()
    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.srcObject = stream
        }
    }, [stream])
    return (
        <LecturePopupContainer shouldSlideIn={shouldSlideIn}>
            <HForm.CloseButton onClick={onClick} />
            <StyledLecturePopup.VideoContainer>
                <StyledLecturePopup.Video
                    ref={videoRef}
                    className="lecture"
                    srcObject={stream}
                    muted={isMuted}
                    autoPlay
                />
                <StyledLecturePopup.IconsContainer>
                    <Composed.Icon icon="icon-desktop" />
                    <Composed.Icon icon="icon-cancel-circled" big />
                    <Composed.Icon
                        icon={isMuted ? 'icon-mic' : 'icon-mic'}
                        onClick={() => setIsMuted(isMuted => !isMuted)}
                    />
                </StyledLecturePopup.IconsContainer>
            </StyledLecturePopup.VideoContainer>
            <StyledLecturePopup.StudentsContainer>
                <AHTLDashboard.Warning white>
                    Na wykładzie nie ma jeszcze żadnego ucznia!
                </AHTLDashboard.Warning>
            </StyledLecturePopup.StudentsContainer>
        </LecturePopupContainer>
    )
}

export default LecturePopup
