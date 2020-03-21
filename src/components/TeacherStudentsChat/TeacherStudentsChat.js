import React, { useEffect, useState, useRef } from 'react'
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

import { delayedApiAxios, apiAxios, handleApiError } from '@utils'

const TeacherTestCreatorContainer = styled(APDashboard.Container)`
    height: 100vh;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
`

const TeacherTestCreator = ({ socket, shouldMenuAppear, setShouldMenuAppear }) => {
    const messagesEnd = useRef()
    const [isLoading, setIsLoading] = useState(true)
    const [shouldParticipantsListAppear, setShouldParticipantsListAppear] = useState(false)
    const [id, setId] = useState('')
    const [schools, setSchools] = useState([])
    const [school, setSchool] = useState('')
    const [grade, setGrade] = useState('')
    const [students, setStudents] = useState([])
    const [messages, setMessages] = useState([])
    const [message, setMessage] = useState('')
    const [onlineStudents, setOnlineStudents] = useState([])
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
        socket.emit('getOnlineStudents', onlineStudents => setOnlineStudents(onlineStudents))
    }, [])
    useEffect(() => {
        socket.once('updateOnlineStudents', onlineStudents => setOnlineStudents(onlineStudents))
    }, [onlineStudents])
    useEffect(() => {
        if (messagesEnd.current) {
            setTimeout(() => {
                messagesEnd.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
            }, 0)
        }
    }, [messages])
    useEffect(() => {
        socket.once('sendMessage', ({ content, student }) => {
            const previousMessage = messages[messages.length - 1]
            setMessages([
                ...messages,
                {
                    id: previousMessage ? previousMessage.id + 1 : 0,
                    content,
                    isTeacher: false,
                    teacher: { id },
                    student
                }
            ])
        })
    }, [messages])
    useEffect(() => {
        if (shouldMenuAppear) {
            setShouldParticipantsListAppear(false)
        }
    }, [shouldMenuAppear])
    const getMessages = async (school, grade) => {
        setIsLoading(true)
        const url = '/api/teacher/getMessages'
        const response = await apiAxios.post(url, {
            school,
            grade
        })
        if (response) {
            setIsLoading(false)
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
            socket.emit('sendMessage', {
                school,
                grade,
                content: message
            })
            setTimeout(() => {
                setMessage('')
            }, 0)
            try {
                const url = '/api/teacher/sendMessage'
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
            {!isLoading &&
                (schools.length > 0 ? (
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
                                    {students.length > 0 ? (
                                        students.map(({ id, name, surname, nick }) => (
                                            <Dashboard.ParticipantContainer key={id}>
                                                <Dashboard.Status
                                                    online={onlineStudents.some(
                                                        student => student.id === id
                                                    )}
                                                />
                                                <Dashboard.Participant>
                                                    {`${name} ${surname}
                                                    ( ${nick} )`}
                                                </Dashboard.Participant>
                                            </Dashboard.ParticipantContainer>
                                        ))
                                    ) : (
                                        <Dashboard.ParticipantContainer>
                                            <Dashboard.Participant>
                                                W klasie {grade} w szkole {school} nie ma jeszcze
                                                żadnego ucznia z aktywnym kontem!
                                            </Dashboard.Participant>
                                        </Dashboard.ParticipantContainer>
                                    )}
                                    <StyledMenu.Option
                                        onClick={() => {
                                            setMessages([])
                                            setSchool('')
                                            setGrade('')
                                            setShouldParticipantsListAppear(false)
                                            socket.emit('leaveRoom', `${school} ${grade}`)
                                        }}
                                    >
                                        Wróć do wyboru szkoły
                                    </StyledMenu.Option>
                                    <StyledMenu.Option
                                        onClick={() => {
                                            setMessages([])
                                            setGrade('')
                                            setShouldParticipantsListAppear(false)
                                            socket.emit('leaveRoom', `${school} ${grade}`)
                                        }}
                                    >
                                        Wróć do wyboru klasy
                                    </StyledMenu.Option>
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
                                                    email: teacherEmail,
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
                                                        <Dashboard.Message
                                                            key={messageId}
                                                            withTeacher
                                                        >
                                                            Ty: <span>{content}</span>
                                                        </Dashboard.Message>
                                                    ) : (
                                                        <Dashboard.Message
                                                            key={messageId}
                                                            withTeacher
                                                        >
                                                            {`Nauczyciel ${teacherName} ${teacherSurname} ( ${teacherEmail} ): `}
                                                            <span>{content}</span>
                                                        </Dashboard.Message>
                                                    )
                                                ) : (
                                                    <Dashboard.Message key={messageId}>
                                                        {`${studentName} ${studentSurname} ( ${studentNick} ): `}
                                                        <span> {content}</span>
                                                    </Dashboard.Message>
                                                )
                                        )
                                    ) : (
                                        <AHTLDashboard.Warning>
                                            W klasie {grade} w szkole {school} nie ma jeszcze żadnej
                                            wiadomośći!
                                        </AHTLDashboard.Warning>
                                    )}
                                    <div ref={messagesEnd}></div>
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
                                                  .grades.map(({ grade }) => grade)
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
                                                  setStudents(
                                                      students.filter(
                                                          ({ isActivated }) => isActivated
                                                      )
                                                  )
                                                  getMessages(school, grade)
                                                  socket.emit('joinRoom', `${school} ${grade}`)
                                              }
                                            : setSchool
                                    }
                                />
                            </AHTCForm.Form>
                        </>
                    )
                ) : (
                    <AHTLDashboard.Warning>
                        Nie należysz jeszcze do żadnej szkoły w której są utworzone klasy!
                    </AHTLDashboard.Warning>
                ))}
        </TeacherTestCreatorContainer>
    )
}

export default compose(withSocket, withMenu)(TeacherTestCreator)
