import React, { useEffect, useRef } from 'react'
import styled, { css } from 'styled-components/macro'

import AHTLDashboard from '@components/AdminHeadTeachersList/styled/Dashboard'
import HForm from '@components/Home/styled/Form'
import StyledLecturePopup from '../styled/LecturePopup'

const LecturePopupContainer = styled.div`
    width: 100%;
    height: 100vh;
    background: rgba(242, 75, 75, 0.95);
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
    const videoRef = useRef()
    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.srcObject = stream
        }
    }, [stream])
    return (
        <LecturePopupContainer shouldSlideIn={shouldSlideIn}>
            <HForm.CloseButton onClick={onClick} />
            <StyledLecturePopup.Video
                ref={videoRef}
                className="lecture"
                srcObject={stream}
                autoPlay
            />
            <StyledLecturePopup.StudentsContainer>
                <AHTLDashboard.Warning white>
                    Na wykładzie nie ma jeszcze żadnego ucznia!
                </AHTLDashboard.Warning>
            </StyledLecturePopup.StudentsContainer>
        </LecturePopupContainer>
    )
}

export default LecturePopup
