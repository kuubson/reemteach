import React, { useEffect, useState } from 'react'
import styled from 'styled-components/macro'

import { compose } from 'redux'
import { withSocket, withMenu } from '@hoc'

import APDashboard from '@components/AdminProfile/styled/Dashboard'
import AHTLDashboard from '@components/AdminHeadTeachersList/styled/Dashboard'
import AHTCForm from '@components/AdminHeadTeacherCreator/styled/Form'

import HTPComposed from '@components/HeadTeacherProfile/composed'

import { setFeedbackData } from '@utils'

const student = new RTCPeerConnection()

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
        socket.emit('getLectures')
        socket.on('getLectures', lectures => {
            setIsLoading(false)
            setLectures(lectures)
        })
        socket.on('updateLectures', lectures => setLectures(lectures))
        socket.on('breakLecture', socketId =>
            setLectures(lectures.filter(lecture => lecture.socketId !== socketId))
        )
        socket.on('answerStudent', async ({ answer }) => await student.setRemoteDescription(answer))
    }, [])
    const joinLecture = async socketId => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true
            })
            student.addStream(stream)
            const offer = await student.createOffer()
            await student.setLocalDescription(new RTCSessionDescription(offer))
            socket.emit('callTeacher', {
                socketId,
                offer
            })
            student.ontrack = ({ streams: [stream] }) => {}
        } catch (error) {
            setFeedbackData('Wystąpił niespodziewany problem podczas dołączania do wykładu!', 'Ok')
        }
    }
    return (
        <StudentLecturesListContainer withMenu={shouldMenuAppear} withMorePadding>
            {!isLoading && (
                <AHTLDashboard.DetailsContainer>
                    {lectures.length > 0 ? (
                        lectures.map(({ socketId, lecturer }) => (
                            <div>
                                <HTPComposed.Detail label="Wykładowca" value={lecturer} />
                                <AHTCForm.Submit
                                    onClick={() => joinLecture(socketId)}
                                    withLessMargin
                                >
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
