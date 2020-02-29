import React, { useEffect, useState } from 'react'
import styled from 'styled-components/macro'

import { compose } from 'redux'
import { withMenu } from '@hoc'

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

const TeacherStudentsList = ({ shouldMenuAppear }) => {
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
                        .map(({ name, grades }) =>
                            grades.map(({ grade }) => {
                                return {
                                    school: name,
                                    grade,
                                    stream: undefined,
                                    shouldLecturePopupAppear: false
                                }
                            })
                        )
                        .flat()
                )
            }
        }
        getStudents()
    }, [])
    const updateLectures = (school, grade, key, value, shouldLecturePopupAppear) => {
        setLectures(
            lectures.map(lecture =>
                lecture.school === school && lecture.grade === grade
                    ? {
                          ...lecture,
                          [key]: value,
                          shouldLecturePopupAppear
                      }
                    : lecture
            )
        )
    }
    const startLecture = (school, grade) => {
        navigator.getUserMedia(
            {
                video: true,
                audio: true
            },
            stream => updateLectures(school, grade, 'stream', stream, true),
            () => {
                setFeedbackData(
                    'Wystąpił niespodziewany problem podczas rozpoczynania wykładu!',
                    'Ok'
                )
            }
        )
    }
    const areThereStudents = students.length > 0
    return (
        <TeacherStudentsListContainer withMenu={shouldMenuAppear} withMorePadding>
            {lectures.map(({ school, grade, stream, shouldLecturePopupAppear }) => (
                <Composed.LecturePopup
                    key={grade}
                    stream={stream}
                    onClick={() => {
                        updateLectures(school, grade, 'stream', stream, false)
                        setTimeout(() => {
                            updateLectures(school, grade, 'stream', undefined, false)
                        }, 700)
                    }}
                    shouldSlideIn={shouldLecturePopupAppear}
                />
            ))}
            {areThereStudents && <HForm.CloseButton onClick={() => setStudents([])} black />}
            {!isLoading && (
                <AHTLDashboard.DetailsContainer>
                    {areThereStudents ? (
                        students.map(({ id, email, name, surname, age, nick, isActivated }) => (
                            <div key={id}>
                                <HTPComposed.Detail label="E-mail" value={email} />
                                {isActivated && (
                                    <>
                                        <HTPComposed.Detail label="Imię" value={name} />
                                        <HTPComposed.Detail label="Nazwisko" value={surname} />
                                        <HTPComposed.Detail label="Wiek" value={age} />
                                        <HTPComposed.Detail label="Pseudonim" value={nick} />
                                    </>
                                )}
                            </div>
                        ))
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
                                                withPointer
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

export default compose(withMenu)(TeacherStudentsList)
