import React, { useEffect, useState } from 'react'
import styled from 'styled-components/macro'

import { compose } from 'redux'
import { withSocket, withMenu, withTest } from '@hoc'

import APDashboard from '@components/AdminProfile/styled/Dashboard'
import AHTLDashboard from '@components/AdminHeadTeachersList/styled/Dashboard'
import TQMDashboard from '@components/TeacherQuestionsManager/styled/Dashboard'
import AHTCForm from '@components/AdminHeadTeacherCreator/styled/Form'
import StyledMenu from '@components/AdminProfile/styled/Menu'
import StyledFileInput from '@components/TeacherQuestionCreator/styled/FileInput'

import HTPComposed from '@components/HeadTeacherProfile/composed'
import HTSCComposed from '@components/HeadTeacherSchoolCreator/composed'

import { delayedApiAxios, setConfirmationPopupData, setFeedbackData } from '@utils'

const TeacherTestCreatorContainer = styled(APDashboard.Container)`
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
`

const TeacherTestCreator = ({ socket, shouldMenuAppear, test, setTest }) => {
    const [isLoading, setIsLoading] = useState(true)
    const [schools, setSchools] = useState([])
    const [school, setSchool] = useState('')
    const [grade, setGrade] = useState('')
    const [questions, setQuestions] = useState([])
    const [students, setStudents] = useState([])
    const [isTestReady, setIsTestReady] = useState(false)
    useEffect(() => {
        const getTest = async () => {
            const url = '/api/teacher/getTest'
            const response = await delayedApiAxios.post(url, {
                test
            })
            if (response) {
                setIsLoading(false)
                const { schools, questions } = response.data
                setSchools(schools)
                setQuestions(questions)
            }
        }
        getTest()
    }, [])
    useEffect(() => {
        socket.on('studentLeavesTest', id => {
            const student = students.find(student => student.id === id)
            if (student) {
                setFeedbackData(`Uczeń ${student.name} ${student.surname} opuścił test!`, 'Ok')
                setStudents(students.filter(student => student.id !== id))
            }
        })
        socket.on('newStudent', student => setStudents([...students, student]))
        socket.on('receiveTest', id => updateStudent(id, true))
        return () => {
            socket.removeListener('studentLeavesTest')
            socket.removeListener('newStudent')
            socket.removeListener('receiveTest')
        }
    }, [students])
    const sendTestNotification = async (school, grade) => {
        const url = '/api/teacher/sendtestNotification'
        await delayedApiAxios.post(url, {
            school,
            grade
        })
    }
    const updateStudent = (id, hasTest) =>
        setStudents(
            students.map(student =>
                student.id === id
                    ? {
                          ...student,
                          hasTest
                      }
                    : student
            )
        )
    return (
        <TeacherTestCreatorContainer withMenu={shouldMenuAppear}>
            {!isLoading && isTestReady ? (
                <>
                    <AHTLDashboard.DetailsContainer>
                        {students.length > 0 ? (
                            <>
                                <StyledMenu.Button
                                    onClick={() => {
                                        socket.emit('sendTest', {
                                            school,
                                            grade,
                                            questions
                                        })
                                    }}
                                    visible
                                    right
                                >
                                    Wyślij
                                </StyledMenu.Button>
                                {students.map(({ id, name, surname, hasTest }) => (
                                    <div key={id}>
                                        <HTPComposed.Detail label="Id ucznia" value={id} />
                                        <HTPComposed.Detail
                                            label="Uczeń"
                                            value={`${name} ${surname}`}
                                        />
                                        <HTPComposed.Detail
                                            label="Otrzymał test"
                                            value={hasTest ? 'Tak' : 'Nie'}
                                        />
                                    </div>
                                ))}
                            </>
                        ) : (
                            <AHTLDashboard.Warning>
                                Do testu nie dołączył jeszcze żaden uczeń!
                            </AHTLDashboard.Warning>
                        )}
                    </AHTLDashboard.DetailsContainer>
                </>
            ) : questions.length > 0 ? (
                grade ? (
                    <AHTLDashboard.DetailsContainer>
                        <StyledMenu.Button
                            onClick={() => {
                                setIsTestReady(true)
                                socket.emit(
                                    'getStudents',
                                    {
                                        school,
                                        grade
                                    },
                                    students => setStudents(students)
                                )
                            }}
                            visible
                            right
                        >
                            Dalej
                        </StyledMenu.Button>
                        {questions.map(
                            ({
                                id,
                                content,
                                answerA,
                                answerB,
                                answerC,
                                answerD,
                                properAnswer,
                                image
                            }) => (
                                <TQMDashboard.DetailOuterContainer key={id}>
                                    <HTPComposed.Detail label="Id pytania" value={id} />
                                    {image && (
                                        <StyledFileInput.ImageContainer>
                                            <StyledFileInput.Image src={image} />
                                        </StyledFileInput.ImageContainer>
                                    )}
                                    <HTPComposed.Detail label="Treść pytania" value={content} />
                                    <HTPComposed.Detail label="Odpowiedź A" value={answerA} />
                                    <HTPComposed.Detail label="Odpowiedź B" value={answerB} />
                                    <HTPComposed.Detail label="Odpowiedź C" value={answerC} />
                                    <HTPComposed.Detail label="Odpowiedź D" value={answerD} />
                                    <HTPComposed.Detail id="properAnswer" value={properAnswer} />
                                    <AHTLDashboard.ButtonsContainer>
                                        <AHTLDashboard.Button
                                            onClick={() => {
                                                setConfirmationPopupData(
                                                    `Czy napewno chcesz usunąć pytanie o id ${id} z testu?`,
                                                    'Tak',
                                                    'Nie',
                                                    () => {
                                                        setQuestions(
                                                            questions.filter(
                                                                question => question.id !== id
                                                            )
                                                        )
                                                        setTest(
                                                            test.filter(
                                                                ({ id: questionId }) =>
                                                                    questionId !== id
                                                            )
                                                        )
                                                    }
                                                )
                                            }}
                                        >
                                            Usuń z testu
                                        </AHTLDashboard.Button>
                                    </AHTLDashboard.ButtonsContainer>
                                </TQMDashboard.DetailOuterContainer>
                            )
                        )}
                    </AHTLDashboard.DetailsContainer>
                ) : (
                    <>
                        <APDashboard.Header>
                            Zaznacz {school ? 'klasę' : 'szkołę'}
                        </APDashboard.Header>
                        <AHTCForm.Form>
                            <HTSCComposed.Select
                                id={school ? 'grade' : 'school'}
                                label={school ? 'Klasa' : 'Szkoła'}
                                value={grade}
                                placeholder={`Zaznacz ${school ? 'klasę' : 'szkołę'}...`}
                                options={
                                    school
                                        ? schools
                                              .find(({ name }) => name === school)
                                              .grades.map(({ grade }) => grade)
                                        : schools.map(({ name }) => name)
                                }
                                onChange={
                                    school
                                        ? grade => {
                                              setGrade(grade)
                                              sendTestNotification(school, grade)
                                          }
                                        : setSchool
                                }
                            />
                        </AHTCForm.Form>
                    </>
                )
            ) : (
                <AHTLDashboard.Warning>
                    Nie dodałeś jeszcze żadnego pytania do testu!
                </AHTLDashboard.Warning>
            )}
        </TeacherTestCreatorContainer>
    )
}

export default compose(withSocket, withMenu, withTest)(TeacherTestCreator)
