import React, { useEffect, useState, useRef } from 'react'
import styled, { css } from 'styled-components/macro'

import AHTLDashboard from '@components/AdminHeadTeachersList/styled/Dashboard'
import HForm from '@components/Home/styled/Form'
import TSLStyledLecturePopup from '@components/TeacherStudentsList/styled/LecturePopup'
import StyledLecturePopup from '../styled/LecturePopup'

import TSLComposed from '@components/TeacherStudentsList/composed'
import Composed from '../composed'

const LecturePopupContainer = styled.div`
    width: 100%;
    height: 100vh;
    background: #f24b4b;
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    top: 110%;
    left: 50%;
    transform: translate(-50%, 0%);
    transition: transform 0.7s ease-in-out, top 0.7s ease-in-out;
    z-index: 3;
    ${({ shouldSlideIn }) => {
        if (shouldSlideIn)
            return css`
                top: 50%;
                transform: translate(-50%, calc(-50% - 1px));
            `
    }}
`

const LecturePopup = ({
    lecturer: { name, surname },
    localStream,
    remoteStream,
    onClick,
    shouldSlideIn
}) => {
    const localStreamRef = useRef()
    const remoteStreamRef = useRef()
    const [isMicrophoneMuted, setIsMicrophoneMuted] = useState(false)
    const [isTeacherMuted, setIsTeacherMuted] = useState(false)
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
                <TSLStyledLecturePopup.Video ref={localStreamRef} muted autoPlay />
                <StyledLecturePopup.IconsContainer>
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
            <TSLStyledLecturePopup.VideoContainer>
                {remoteStream ? (
                    <>
                        <StyledLecturePopup.Video
                            ref={remoteStreamRef}
                            muted={isTeacherMuted}
                            autoPlay
                        />
                        <TSLStyledLecturePopup.IconsContainer>
                            <TSLComposed.Icon
                                icon={isTeacherMuted ? 'icon-volume-off' : 'icon-volume-low'}
                                onClick={() => setIsTeacherMuted(isTeacherMuted => !isTeacherMuted)}
                            />
                        </TSLStyledLecturePopup.IconsContainer>
                    </>
                ) : (
                    <AHTLDashboard.Warning white>
                        Nauczyciel nie dołączył jeszcze do rozmowy!
                    </AHTLDashboard.Warning>
                )}
                <StyledLecturePopup.Teacher>
                    {name} {surname}
                </StyledLecturePopup.Teacher>
            </TSLStyledLecturePopup.VideoContainer>
        </LecturePopupContainer>
    )
}

export default LecturePopup
