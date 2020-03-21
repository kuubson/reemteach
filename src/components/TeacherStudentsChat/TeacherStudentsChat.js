import React, { useEffect, useState } from 'react'
import styled from 'styled-components/macro'
import axios from 'axios'

import { compose } from 'redux'
import { withSocket, withMenu } from '@hoc'

import APDashboard from '@components/AdminProfile/styled/Dashboard'
import AHTLDashboard from '@components/AdminHeadTeachersList/styled/Dashboard'
import AHTCForm from '@components/AdminHeadTeacherCreator/styled/Form'
import HForm from '@components/Home/styled/Form'
import StyledMenu from '@components/AdminProfile/styled/Menu'
import Dashboard from './styled/Dashboard'

import HTSCComposed from '@components/HeadTeacherSchoolCreator/composed'

import { delayedApiAxios, handleApiError } from '@utils'

const TeacherTestCreatorContainer = styled(APDashboard.Container)`
    height: 100vh;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
`

const TeacherTestCreator = ({ shouldMenuAppear, setShouldMenuAppear }) => {
    const [isLoading, setIsLoading] = useState(true)
    const [shouldParticipantsListAppear, setShouldParticipantsListAppear] = useState(false)
    const [id, setId] = useState('')
    const [schools, setSchools] = useState([])
    const [school, setSchool] = useState('')
    const [grade, setGrade] = useState('')
    const [students, setStudents] = useState([])
    const [messages, setMessages] = useState([])
    const [message, setMessage] = useState('')
    useEffect(() => {
        const getStudentsForChat = async () => {
            const url = '/api/teacher/getStudentsForChat'
            const response = await delayedApiAxios.get(url)
            if (response) {
                setIsLoading(false)
                const { id, schools } = response.data
                setId(id)
                setSchools(schools)
            }
        }
        getStudentsForChat()
    }, [])
    useEffect(() => {
        if (shouldMenuAppear) {
            setShouldParticipantsListAppear(false)
        }
    }, [shouldMenuAppear])
    const getMessages = async (school, grade) => {
        const url = '/api/teacher/getMessages'
        const response = await delayedApiAxios.post(url, {
            school,
            grade
        })
        if (response) {
            const { messages } = response.data
            setMessages(messages)
        }
    }
    const sendMessage = async message => {
        if (message) {
            const previousMessage = messages[messages.length - 1]
            setMessages([
                ...messages,
                {
                    id: previousMessage ? previousMessage.id + 1 : 0,
                    content: message,
                    isTeacher: true,
                    teacher: { id },
                    student: {}
                }
            ])
            setTimeout(() => {
                setMessage('')
            }, 0)
            try {
                const url = '/api/teacher/sendMessageForStudents'
                await axios.post(url, {
                    content: message,
                    school,
                    grade
                })
            } catch (error) {
                handleApiError(error)
            }
        } else {
            setTimeout(() => {
                setMessage('')
            }, 0)
        }
    }
    return (
        <TeacherTestCreatorContainer withMenu={shouldMenuAppear}>
            {!isLoading && schools.length > 0 ? (
                grade ? (
                    <>
                        <StyledMenu.Button
                            onClick={() => {
                                setShouldParticipantsListAppear(true)
                                setShouldMenuAppear(false)
                            }}
                            visible={!shouldParticipantsListAppear}
                            right
                        >
                            Lista uczniów
                        </StyledMenu.Button>
                        <Dashboard.ParticipantsList visible={shouldParticipantsListAppear}>
                            <HForm.CloseButton
                                onClick={() => {
                                    setShouldParticipantsListAppear(false)
                                }}
                                left
                            />
                            <StyledMenu.OptionsContainer>
                                {students.map(({ id, name, surname, nick }) => (
                                    <Dashboard.ParticipantContainer key={id}>
                                        <Dashboard.Status />
                                        <Dashboard.Participant>
                                            {nick} ( {name} {surname} )
                                        </Dashboard.Participant>
                                    </Dashboard.ParticipantContainer>
                                ))}
                            </StyledMenu.OptionsContainer>
                        </Dashboard.ParticipantsList>
                        <Dashboard.ChatContainer
                            shorter={shouldParticipantsListAppear}
                            withoutMessages={!messages.length > 0}
                        >
                            <Dashboard.MessagesContainer withoutMessages={!messages.length > 0}>
                                {messages.length > 0 ? (
                                    messages.map(
                                        ({
                                            id: messageId,
                                            content,
                                            isTeacher,
                                            teacher: {
                                                id: teacherId,
                                                name: teacherName,
                                                surname: teacherSurname
                                            },
                                            student: {
                                                name: studentName,
                                                surname: studentSurname,
                                                nick: studentNick
                                            }
                                        }) =>
                                            isTeacher ? (
                                                id === teacherId ? (
                                                    <Dashboard.Message key={messageId} withTeacher>
                                                        Ty: {content}
                                                    </Dashboard.Message>
                                                ) : (
                                                    <Dashboard.Message key={messageId} withTeacher>
                                                        {`Nauczyciel ( ${teacherName} ${teacherSurname} ): ${content}`}
                                                    </Dashboard.Message>
                                                )
                                            ) : (
                                                <Dashboard.Message key={messageId}>
                                                    {`${studentNick} ( ${studentName} ${studentSurname} ): ${content}`}
                                                </Dashboard.Message>
                                            )
                                    )
                                ) : (
                                    <AHTLDashboard.Warning>
                                        W klasie {grade} w szkole {school} nie ma jeszcze żadnej
                                        wiadomośći!
                                    </AHTLDashboard.Warning>
                                )}
                            </Dashboard.MessagesContainer>
                            <Dashboard.MessageFieldContainer
                                onKeyPress={e => {
                                    if (e.key === 'Enter') {
                                        sendMessage(message)
                                    }
                                }}
                            >
                                <Dashboard.MessageField
                                    value={message}
                                    placeholder="Wpisz wiadomość..."
                                    onChange={e => setMessage(e.target.value)}
                                />
                                <Dashboard.Submit onClick={() => sendMessage(message)}>
                                    Wyślij
                                </Dashboard.Submit>
                            </Dashboard.MessageFieldContainer>
                        </Dashboard.ChatContainer>
                    </>
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
                                              .grades.filter(({ students }) => students.length > 0)
                                              .map(({ grade }) => grade)
                                        : schools.map(({ name }) => name)
                                }
                                onChange={
                                    school
                                        ? grade => {
                                              setGrade(grade)
                                              const foundSchool = schools.find(
                                                  ({ name }) => name === school
                                              )
                                              const { students } = foundSchool.grades.find(
                                                  schoolGrade => schoolGrade.grade === grade
                                              )
                                              setStudents(students)
                                              getMessages(school, grade)
                                          }
                                        : setSchool
                                }
                            />
                        </AHTCForm.Form>
                    </>
                )
            ) : (
                <AHTLDashboard.Warning>
                    Nie należysz jeszcze do żadnej szkoły!
                </AHTLDashboard.Warning>
            )}
        </TeacherTestCreatorContainer>
    )
}

export default compose(withSocket, withMenu)(TeacherTestCreator)
