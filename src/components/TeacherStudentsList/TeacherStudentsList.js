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

const teacher = new RTCPeerConnection()

teacher.ontrack = ({ streams: [stream] }) => (document.getElementById('student').srcObject = stream)

const TeacherStudentsListContainer = styled(APDashboard.Container)`
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
`

const TeacherStudentsList = ({ socket, shouldMenuAppear }) => {
    const [isLoading, setIsLoading] = useState(true)
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
        socket.on('callTeacher', async ({ room, offer }) => {
            await teacher.setRemoteDescription(offer)
            const answer = await teacher.createAnswer()
            await teacher.setLocalDescription(new RTCSessionDescription(answer))
            socket.emit('answerStudent', {
                room,
                answer
            })
        })
        return () => socket.removeListener('callTeacher')
    }, [])
    const updateLectures = (school, grade, stream, shouldLecturePopupAppear) => {
        setLectures(
            lectures.map(lecture =>
                lecture.school === school && lecture.grade === grade
                    ? {
                          ...lecture,
                          stream,
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
            const stream = await mediaDevices.getUserMedia({
                video: true,
                audio: true
            })
            stream.getTracks().map(track => teacher.addTrack(track, stream))
            socket.emit('startLecture', {
                school,
                grade
            })
            updateLectures(school, grade, stream, true)
        } catch (error) {
            setFeedbackData('Wystąpił niespodziewany problem przy rozpoczynaniu wykładu!', 'Ok')
        }
    }
    return (
        <TeacherStudentsListContainer withMenu={shouldMenuAppear} withMorePadding>
            {lectures.map(({ school, grade, stream, shouldLecturePopupAppear }) => (
                <Composed.LecturePopup
                    key={`${school} ${grade}`}
                    school={school}
                    grade={grade}
                    stream={stream}
                    onClick={() => updateLectures(school, grade, stream, false)}
                    shouldSlideIn={shouldLecturePopupAppear}
                />
            ))}
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
