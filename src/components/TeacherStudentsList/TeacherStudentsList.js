import React, { useEffect, useState } from 'react'
import styled from 'styled-components/macro'

import { compose } from 'redux'
import { withSocket, withMenu } from '@hoc'

import APDashboard from '@components/AdminProfile/styled/Dashboard'
import AHTLDashboard from '@components/AdminHeadTeachersList/styled/Dashboard'
import AHTCForm from '@components/AdminHeadTeacherCreator/styled/Form'
import HForm from '@components/Home/styled/Form'
import Dashboard from './styled/Dashboard'

import HTPComposed from '@components/HeadTeacherProfile/composed'
import Composed from './composed'

import { delayedApiAxios, setFeedbackData } from '@utils'

const TeacherStudentsListContainer = styled(APDashboard.Container)`
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
`

const TeacherStudentsList = ({ socket, shouldMenuAppear }) => {
    const [isLoading, setIsLoading] = useState(true)
    const [teacher, setTeacher] = useState(new RTCPeerConnection())
    const [schools, setSchools] = useState([])
    const [students, setStudents] = useState([])
    const [lectures, setLectures] = useState([])
    useEffect(() => {
        const getStudents = async () => {
            const url = '/api/teacher/getStudents'
            const response = await delayedApiAxios.get(url)
            if (response) {
                setIsLoading(false)
                const { schools } = response.data
                setSchools(schools)
                setLectures(
                    schools
                        .map(({ id, name, grades }) =>
                            grades.map(({ grade }) => {
                                return {
                                    id,
                                    school: name,
                                    grade
                                }
                            })
                        )
                        .flat()
                )
            }
        }
        getStudents()
    }, [])
    useEffect(() => {
        socket.on('candidate', async candidate => await teacher.addIceCandidate(candidate))
        return () => socket.removeListener('candidate')
    }, [teacher])
    const updateLectures = (
        school,
        grade,
        student,
        localStream,
        remoteStream,
        shouldLecturePopupAppear
    ) => {
        setLectures(
            lectures.map(lecture =>
                lecture.school === school && lecture.grade === grade
                    ? {
                          ...lecture,
                          student,
                          localStream,
                          remoteStream,
                          shouldLecturePopupAppear
                      }
                    : lecture
            )
        )
    }
    const startLecture = async (school, grade) => {
        try {
            const { mediaDevices } = navigator
            if (!mediaDevices) {
                return setFeedbackData(
                    'Twoja przeglądarka nie wspiera używania kamery lub mikrofonu!',
                    'Ok'
                )
            }
            const localStream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true
            })
            localStream.getTracks().map(track => teacher.addTrack(track, localStream))
            socket.emit('startLecture', {
                school,
                grade
            })
            socket.once('call', async ({ student, offer }) => {
                teacher.onicecandidate = ({ candidate }) => socket.emit('candidate', candidate)
                teacher.ontrack = ({ streams: [remoteStream] }) =>
                    updateLectures(school, grade, student, localStream, remoteStream, true)
                await teacher.setRemoteDescription(new RTCSessionDescription(offer))
                const answer = await teacher.createAnswer()
                await teacher.setLocalDescription(answer)
                socket.emit('answer', answer)
            })
            socket.once('leaveLecture', () => {
                teacher.close()
                localStream.getTracks().map(track => track.stop())
                setTeacher(new RTCPeerConnection())
                socket.emit('leaveLecture')
                setFeedbackData('Uczeń opuścił wykład!', 'Ok')
                updateLectures(school, grade, undefined, undefined, undefined, false)
            })
            updateLectures(school, grade, undefined, localStream, undefined, true)
        } catch (error) {
            setFeedbackData('Wystąpił niespodziewany problem przy rozpoczynaniu wykładu!', 'Ok')
        }
    }
    return (
        <TeacherStudentsListContainer withMenu={shouldMenuAppear} withMorePadding>
            {lectures.map(
                ({
                    school,
                    grade,
                    student,
                    localStream,
                    remoteStream,
                    shouldLecturePopupAppear
                }) => (
                    <Composed.LecturePopup
                        key={`${school} ${grade}`}
                        school={school}
                        grade={grade}
                        student={student}
                        localStream={localStream}
                        remoteStream={remoteStream}
                        onClick={() => {
                            updateLectures(school, grade, student, localStream, remoteStream, false)
                            setTimeout(() => {
                                teacher.close()
                                localStream.getTracks().map(track => track.stop())
                                setTeacher(new RTCPeerConnection())
                                socket.emit('finishLecture')
                            }, 700)
                        }}
                        switchStream={async () => {
                            localStream.getTracks().map(track => track.stop())
                            const captureStream = await navigator.mediaDevices.getDisplayMedia({
                                video: true,
                                audio: true
                            })
                            updateLectures(
                                school,
                                grade,
                                student,
                                captureStream,
                                remoteStream,
                                true
                            )
                            teacher
                                .getSenders()
                                .map(sender =>
                                    captureStream
                                        .getTracks()
                                        .map(track => sender.replaceTrack(track))
                                )
                        }}
                        shouldSlideIn={shouldLecturePopupAppear}
                    />
                )
            )}
            {!isLoading && (
                <AHTLDashboard.DetailsContainer>
                    {students.length > 0 ? (
                        <>
                            <HForm.CloseButton onClick={() => setStudents([])} black />
                            {students.map(
                                ({ id, email, name, surname, age, nick, isActivated }) => (
                                    <div key={id}>
                                        <HTPComposed.Detail label="E-mail" value={email} />
                                        {isActivated && (
                                            <>
                                                <HTPComposed.Detail label="Imię" value={name} />
                                                <HTPComposed.Detail
                                                    label="Nazwisko"
                                                    value={surname}
                                                />
                                                <HTPComposed.Detail label="Wiek" value={age} />
                                                <HTPComposed.Detail
                                                    label="Pseudonim"
                                                    value={nick}
                                                />
                                            </>
                                        )}
                                    </div>
                                )
                            )}
                        </>
                    ) : schools.length > 0 ? (
                        schools.map(({ id, name, grades }) => (
                            <div key={id}>
                                <HTPComposed.Detail label="Szkoła" value={name} />
                                {grades.length > 0 ? (
                                    grades.map(({ grade, students }) => (
                                        <Dashboard.DetailOuterContainer key={grade}>
                                            <HTPComposed.Detail
                                                label="Klasa"
                                                value={grade}
                                                onClick={() => setStudents(students)}
                                                withPointer={students.length > 0}
                                            />
                                            {students.length <= 0 ? (
                                                <Dashboard.Warning>
                                                    W klasie {grade} nie ma jeszcze żadnego ucznia!
                                                </Dashboard.Warning>
                                            ) : (
                                                <AHTCForm.Submit
                                                    onClick={() => startLecture(name, grade)}
                                                    withLessMargin
                                                >
                                                    Rozpocznij wykład
                                                </AHTCForm.Submit>
                                            )}
                                        </Dashboard.DetailOuterContainer>
                                    ))
                                ) : (
                                    <Dashboard.Warning>
                                        W szkole nie ma jeszcze żadnej klasy!
                                    </Dashboard.Warning>
                                )}
                            </div>
                        ))
                    ) : (
                        <AHTLDashboard.Warning>
                            Nie należysz do żadnej szkoły!
                        </AHTLDashboard.Warning>
                    )}
                </AHTLDashboard.DetailsContainer>
            )}
        </TeacherStudentsListContainer>
    )
}

export default compose(withSocket, withMenu)(TeacherStudentsList)
