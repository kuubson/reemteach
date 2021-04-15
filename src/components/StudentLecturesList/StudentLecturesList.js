import React, { useEffect, useState } from 'react'
import styled from 'styled-components/macro'

import { compose } from 'redux'
import { withSocket, withMenu } from 'hoc'

import APDashboard from 'components/AdminProfile/styled/Dashboard'
import AHTLDashboard from 'components/AdminHeadTeachersList/styled/Dashboard'
import AHTCForm from 'components/AdminHeadTeacherCreator/styled/Form'

import HTPComposed from 'components/HeadTeacherProfile/composed'
import Composed from './composed'

import { setFeedbackData } from 'utils'

const StudentLecturesListContainer = styled(APDashboard.Container)`
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
`

const StudentLecturesList = ({ socket, shouldMenuAppear }) => {
    const [isLoading, setIsLoading] = useState(true)
    const [student, setStudent] = useState(new RTCPeerConnection())
    const [lectures, setLectures] = useState([])
    const [localStream, setLocalStream] = useState()
    useEffect(() => {
        socket.emit('getLectures', lectures => {
            setIsLoading(false)
            setLectures(lectures)
        })
        socket.on('updateLectures', updatedLectures => setLectures(updatedLectures))
        return () => socket.removeListener('updateLectures')
    }, [])
    useEffect(() => {
        socket.on('breakLecture', ({ socketId, room }) => {
            if (
                lectures.some(
                    lecture => lecture.socketId === socketId && lecture.shouldLecturePopupAppear
                )
            ) {
                student.close()
                localStream.getTracks().map(track => track.stop())
                setStudent(new RTCPeerConnection())
                socket.emit('leaveRoom', room)
                setFeedbackData('Nauczyciel zakończył rozmowę!', 'Ok')
            }
            setLectures(lectures.filter(lecture => lecture.socketId !== socketId))
        })
        socket.on('finishLecture', room => {
            student.close()
            localStream.getTracks().map(track => track.stop())
            setStudent(new RTCPeerConnection())
            socket.emit('leaveRoom', room)
            setFeedbackData('Nauczyciel zakończył rozmowę!', 'Ok')
        })
        return () => {
            socket.removeListener('finishLecture')
            socket.removeListener('breakLecture')
        }
    }, [lectures, localStream])
    useEffect(() => {
        socket.on('answer', async answer => await student.setRemoteDescription(answer))
        socket.on('candidate', async candidate => await student.addIceCandidate(candidate))
        return () => {
            socket.removeListener('answer')
            socket.removeListener('candidate')
        }
    }, [student])
    const updateLectures = (room, localStream, remoteStream, shouldLecturePopupAppear) => {
        setLectures(
            lectures.map(lecture =>
                lecture.lecturer.room === room
                    ? {
                          ...lecture,
                          localStream,
                          remoteStream,
                          shouldLecturePopupAppear
                      }
                    : lecture
            )
        )
    }
    const joinLecture = room => {
        try {
            const { mediaDevices } = navigator
            if (!mediaDevices) {
                return setFeedbackData(
                    'Twoja przeglądarka nie wspiera używania kamery lub mikrofonu!',
                    'Ok'
                )
            }
            socket.emit('checkRoom', room, async isRoomTaken => {
                if (isRoomTaken) {
                    setFeedbackData('Nauczyciel prowadzi już rozmowę z innym uczniem!', 'Ok')
                } else {
                    const localStream = await mediaDevices.getUserMedia({
                        video: true,
                        audio: true
                    })
                    setLocalStream(localStream)
                    localStream.getTracks().map(track => student.addTrack(track, localStream))
                    student.onicecandidate = ({ candidate }) => socket.emit('candidate', candidate)
                    student.ontrack = ({ streams: [remoteStream] }) =>
                        updateLectures(room, localStream, remoteStream, true)
                    const offer = await student.createOffer()
                    await student.setLocalDescription(offer)
                    socket.emit('call', {
                        room,
                        offer
                    })
                    updateLectures(room, localStream, undefined, true)
                }
            })
        } catch (error) {
            setFeedbackData(
                'Wystąpił niespodziewany problem przy dołączaniu do indywidualnego wykładu!',
                'Ok'
            )
        }
    }
    return (
        <StudentLecturesListContainer withMenu={shouldMenuAppear}>
            {lectures.map(
                ({
                    lecturer: { id, name, surname, room },
                    localStream,
                    remoteStream,
                    shouldLecturePopupAppear
                }) => (
                    <Composed.LecturePopup
                        key={id}
                        lecturer={{
                            name,
                            surname
                        }}
                        localStream={localStream}
                        remoteStream={remoteStream}
                        onClick={() => {
                            socket.emit('leaveLecture', room)
                            localStream.getTracks().map(track => track.stop())
                            updateLectures(room, localStream, remoteStream, false)
                        }}
                        shouldSlideIn={shouldLecturePopupAppear}
                    />
                )
            )}
            {!isLoading && (
                <AHTLDashboard.DetailsContainer>
                    {lectures.length > 0 ? (
                        lectures.map(({ lecturer: { id, name, surname, room } }) => (
                            <div key={id}>
                                <HTPComposed.Detail label="Id prowadzącego" value={id} />
                                <HTPComposed.Detail
                                    label="Prowadzący"
                                    value={`${name} ${surname}`}
                                />
                                <AHTCForm.Submit onClick={() => joinLecture(room)} withLessMargin>
                                    Dołącz
                                </AHTCForm.Submit>
                            </div>
                        ))
                    ) : (
                        <AHTLDashboard.Warning>
                            Aktualnie nie jest prowadzony żaden indywidualny wykład!
                        </AHTLDashboard.Warning>
                    )}
                </AHTLDashboard.DetailsContainer>
            )}
        </StudentLecturesListContainer>
    )
}

export default compose(withSocket, withMenu)(StudentLecturesList)
