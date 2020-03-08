import React, { useEffect, useState, useRef } from 'react'
import styled, { css } from 'styled-components/macro'

import AHTLDashboard from '@components/AdminHeadTeachersList/styled/Dashboard'
import HForm from '@components/Home/styled/Form'
import SLLStyledLecturePopup from '@components/StudentLecturesList/styled/LecturePopup'
import StyledLecturePopup from '../styled/LecturePopup'

import Composed from '../composed'

const LecturePopupContainer = styled.div`
    width: 100%;
    height: 100vh;
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

const LecturePopup = ({ localStream, remoteStream, onClick, shouldSlideIn }) => {
    const localStreamRef = useRef()
    const remoteStreamRef = useRef()
    const [isMicrophoneMuted, setIsMicrophoneMuted] = useState(false)
    const [isStudentMuted, setIsStudentMuted] = useState(false)
    useEffect(() => {
        if (localStreamRef.current) {
            localStreamRef.current.srcObject = localStream
        }
        if (remoteStreamRef.current) {
            remoteStreamRef.current.srcObject = remoteStream
        }
    }, [localStream, remoteStream])
    return (
        <LecturePopupContainer shouldSlideIn={shouldSlideIn}>
            <HForm.CloseButton onClick={onClick} />
            <StyledLecturePopup.VideoContainer>
                <StyledLecturePopup.Video ref={localStreamRef} muted autoPlay />
                <StyledLecturePopup.IconsContainer>
                    <Composed.Icon icon="icon-desktop" />
                    <Composed.Icon
                        icon={isMicrophoneMuted ? 'icon-mute' : 'icon-mic'}
                        onClick={() => {
                            const [audio] = localStream.getAudioTracks()
                            audio.enabled = !audio.enabled
                            setIsMicrophoneMuted(isMicrophoneMuted => !isMicrophoneMuted)
                        }}
                    />
                </StyledLecturePopup.IconsContainer>
            </StyledLecturePopup.VideoContainer>
            <SLLStyledLecturePopup.VideoContainer>
                {remoteStream ? (
                    <>
                        <StyledLecturePopup.Video
                            ref={remoteStreamRef}
                            muted={isStudentMuted}
                            autoPlay
                        />
                        <StyledLecturePopup.IconsContainer>
                            <Composed.Icon
                                icon={isStudentMuted ? 'icon-volume-off' : 'icon-volume-low'}
                                onClick={() => setIsStudentMuted(isStudentMuted => !isStudentMuted)}
                            />
                        </StyledLecturePopup.IconsContainer>
                    </>
                ) : (
                    <AHTLDashboard.Warning white>
                        Uczeń nie dołączył jeszcze do wykładu!
                    </AHTLDashboard.Warning>
                )}
            </SLLStyledLecturePopup.VideoContainer>
        </LecturePopupContainer>
    )
}

export default LecturePopup
