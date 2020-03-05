import React, { useEffect, useState, useRef } from 'react'
import styled, { css } from 'styled-components/macro'

import { compose } from 'redux'
import { withSocket } from '@hoc'

import AHTLDashboard from '@components/AdminHeadTeachersList/styled/Dashboard'
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

const LecturePopup = ({ socket, onClick, shouldSlideIn }) => {
    const canvasRef = useRef()
    const [isMuted, setIsMuted] = useState(false)
    const [video, setVideo] = useState()
    const [audio, setAudio] = useState()
    useEffect(() => {
        if (shouldSlideIn) {
            socket.on('video', video => setVideo(video))
            socket.on('audio', audioBuffer =>
                setAudio(window.URL.createObjectURL(new Blob([audioBuffer])))
            )
        } else {
            socket.removeListener('video')
            socket.removeListener('audio')
        }
        return () => {
            socket.removeListener('video')
            socket.removeListener('audio')
        }
    }, [shouldSlideIn])
    return (
        <LecturePopupContainer shouldSlideIn={shouldSlideIn}>
            <HForm.CloseButton onClick={onClick} />
            <TSLStyledLecturePopup.Canvas ref={canvasRef} />
            <TSLStyledLecturePopup.VideoContainer>
                <TSLStyledLecturePopup.Image src={video} />
                <TSLStyledLecturePopup.Audio src={audio} autoPlay />
                <TSLStyledLecturePopup.IconsContainer>
                    <TSLComposed.Icon icon="icon-desktop" />
                    <TSLComposed.Icon icon="icon-cancel-circled" big />
                    <TSLComposed.Icon
                        icon={isMuted ? 'icon-mute' : 'icon-mic'}
                        onClick={() => setIsMuted(isMuted => !isMuted)}
                    />
                </TSLStyledLecturePopup.IconsContainer>
            </TSLStyledLecturePopup.VideoContainer>
            <TSLStyledLecturePopup.StudentsContainer></TSLStyledLecturePopup.StudentsContainer>
        </LecturePopupContainer>
    )
}

export default compose(withSocket)(LecturePopup)
