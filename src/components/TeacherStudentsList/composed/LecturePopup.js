import React, { useEffect, useState, useRef } from 'react'
import styled, { css } from 'styled-components/macro'

import { compose } from 'redux'
import { withSocket } from '@hoc'

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

const LecturePopup = ({ socket, school, grade, stream, students, onClick, shouldSlideIn }) => {
    const videoRef = useRef()
    const canvasRef = useRef()
    const [videoIntervalId, setVideoIntervalId] = useState()
    const [audioIntervalId, setAudioIntervalId] = useState()
    const [isMuted, setIsMuted] = useState(false)
    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.srcObject = stream
        }
    }, [stream])
    useEffect(() => {
        if (shouldSlideIn && canvasRef.current) {
            const context = canvasRef.current.getContext('2d')
            setVideoIntervalId(
                setInterval(() => {
                    context.drawImage(
                        videoRef.current,
                        0,
                        0,
                        canvasRef.current.width,
                        canvasRef.current.height
                    )
                    socket.emit('video', {
                        school,
                        grade,
                        stream: canvasRef.current.toDataURL('image/webp')
                    })
                }, 60)
            )
        } else {
            window.clearInterval(videoIntervalId)
            window.clearInterval(audioIntervalId)
        }
        if (shouldSlideIn && !isMuted && stream) {
            const recorder = new MediaRecorder(stream)
            let chunks = []
            recorder.onstart = () => (chunks = [])
            recorder.ondataavailable = ({ data }) => chunks.push(data)
            recorder.onstop = () => socket.emit('audio', new Blob(chunks))
            recorder.start()
            setAudioIntervalId(
                setInterval(() => {
                    recorder.stop()
                    recorder.start()
                }, 1000)
            )
        } else {
            window.clearInterval(audioIntervalId)
        }
        return () => {
            window.clearInterval(videoIntervalId)
            window.clearInterval(audioIntervalId)
        }
    }, [shouldSlideIn, isMuted])
    return (
        <LecturePopupContainer shouldSlideIn={shouldSlideIn}>
            <HForm.CloseButton onClick={onClick} />
            <StyledLecturePopup.Canvas ref={canvasRef} />
            <StyledLecturePopup.VideoContainer>
                <StyledLecturePopup.Video ref={videoRef} autoPlay muted />
                <StyledLecturePopup.IconsContainer>
                    <Composed.Icon icon="icon-desktop" />
                    <Composed.Icon icon="icon-cancel-circled" big />
                    <Composed.Icon
                        icon={isMuted ? 'icon-mute' : 'icon-mic'}
                        onClick={() => setIsMuted(isMuted => !isMuted)}
                    />
                </StyledLecturePopup.IconsContainer>
            </StyledLecturePopup.VideoContainer>
            <StyledLecturePopup.StudentsContainer>
                {students.length > 0 ? (
                    students.map(({ id, stream, fullName }) => (
                        <Composed.Student key={id} stream={stream} fullName={fullName} />
                    ))
                ) : (
                    <AHTLDashboard.Warning white>
                        Na wykładzie nie ma jeszcze żadnego ucznia!
                    </AHTLDashboard.Warning>
                )}
            </StyledLecturePopup.StudentsContainer>
        </LecturePopupContainer>
    )
}

export default compose(withSocket)(LecturePopup)
