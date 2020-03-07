import React, { useEffect, useState } from 'react'
import styled from 'styled-components/macro'

import { compose } from 'redux'
import { withSocket, withMenu } from '@hoc'

import APDashboard from '@components/AdminProfile/styled/Dashboard'
import AHTLDashboard from '@components/AdminHeadTeachersList/styled/Dashboard'
import AHTCForm from '@components/AdminHeadTeacherCreator/styled/Form'

import HTPComposed from '@components/HeadTeacherProfile/composed'
import Composed from './composed'

import { setFeedbackData } from '@utils'

const student = new RTCPeerConnection()

student.ontrack = ({ streams: [stream] }) => (document.getElementById('teacher').srcObject = stream)

const StudentLecturesListContainer = styled(APDashboard.Container)`
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
`

const StudentLecturesList = ({ socket, shouldMenuAppear }) => {
    const [isLoading, setIsLoading] = useState(true)
    const [lectures, setLectures] = useState([])
    useEffect(() => {
        socket.emit('getLectures', lectures => {
            setIsLoading(false)
            setLectures(lectures)
        })
        socket.on('updateLectures', updatedLectures => setLectures(updatedLectures))
        socket.on('answerStudent', async answer => await student.setRemoteDescription(answer))
        return () => {
            socket.removeListener('updateLectures')
            socket.removeListener('answerStudent')
        }
    }, [])
    useEffect(() => {
        socket.on('breakLecture', socketId =>
            setLectures(lectures.filter(lecture => lecture.socketId !== socketId))
        )
        return () => socket.removeListener('breakLecture')
    }, [lectures])
    const updateLectures = (room, stream, shouldLecturePopupAppear) => {
        setLectures(
            lectures.map(lecture =>
                lecture.lecturer.room === room
                    ? {
                          ...lecture,
                          stream,
                          shouldLecturePopupAppear
                      }
                    : lecture
            )
        )
    }
    const joinLecture = async room => {
        try {
            const { mediaDevices } = navigator
            if (!mediaDevices) {
                return setFeedbackData(
                    'Twoja przeglądarka nie wspiera używania kamery lub mikrofonu!',
                    'Ok'
                )
            }
            const stream = await mediaDevices.getUserMedia({
                video: true,
                audio: true
            })
            stream.getTracks().map(track => student.addTrack(track, stream))
            const offer = await student.createOffer()
            await student.setLocalDescription(new RTCSessionDescription(offer))
            socket.emit('joinLecture', {
                room,
                offer
            })
            updateLectures(room, stream, true)
        } catch (error) {
            setFeedbackData('Wystąpił niespodziewany problem przy dołączaniu do wykładu!', 'Ok')
        }
    }
    return (
        <StudentLecturesListContainer withMenu={shouldMenuAppear} withMorePadding>
            {lectures.map(({ lecturer: { id, room }, stream, shouldLecturePopupAppear }) => (
                <Composed.LecturePopup
                    key={id}
                    stream={stream}
                    onClick={() => updateLectures(room, stream, false)}
                    shouldSlideIn={shouldLecturePopupAppear}
                />
            ))}
            {!isLoading && (
                <AHTLDashboard.DetailsContainer>
                    {lectures.length > 0 ? (
                        lectures.map(({ lecturer: { id, name, surname, room } }) => (
                            <div key={id}>
                                <HTPComposed.Detail
                                    label="Wykładowca"
                                    value={`${name} ${surname}`}
                                />
                                <AHTCForm.Submit onClick={() => joinLecture(room)} withLessMargin>
                                    Dołącz
                                </AHTCForm.Submit>
                            </div>
                        ))
                    ) : (
                        <AHTLDashboard.Warning>
                            Aktualnie nie jest prowadzony żaden wykład!
                        </AHTLDashboard.Warning>
                    )}
                </AHTLDashboard.DetailsContainer>
            )}
        </StudentLecturesListContainer>
    )
}

export default compose(withSocket, withMenu)(StudentLecturesList)
