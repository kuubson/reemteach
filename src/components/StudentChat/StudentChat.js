import React, { useEffect, useState, useRef } from 'react'
import styled from 'styled-components/macro'
import axios from 'axios'

import { compose } from 'redux'
import { withSocket, withMenu } from '@hoc'

import APDashboard from '@components/AdminProfile/styled/Dashboard'
import AHTLDashboard from '@components/AdminHeadTeachersList/styled/Dashboard'
import HForm from '@components/Home/styled/Form'
import StyledMenu from '@components/AdminProfile/styled/Menu'
import TSCDashboard from '@components/TeacherStudentsChat/styled/Dashboard'

import { delayedApiAxios, handleApiError } from '@utils'

const StudentChatContainer = styled(APDashboard.Container)`
    height: 100vh;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
`

const StudentChat = ({ socket, shouldMenuAppear, setShouldMenuAppear }) => {
    const messagesEnd = useRef()
    const [isLoading, setIsLoading] = useState(false)
    const [shouldParticipantsListAppear, setShouldParticipantsListAppear] = useState(false)
    const [id, setId] = useState('')
    const [teachers, setTeachers] = useState([])
    const [messages, setMessages] = useState([])
    const [message, setMessage] = useState('')
    const [onlineTeachers, setOnlineTeachers] = useState([])
    useEffect(() => {
        const getMessages = async () => {
            const url = '/api/student/getMessages'
            const response = await delayedApiAxios.get(url)
            if (response) {
                setIsLoading(false)
                const { id, teachers, messages } = response.data
                setId(id)
                setTeachers(teachers)
                setMessages(messages)
            }
        }
        getMessages()
        socket.emit('getOnlineTeachers', onlineTeachers => setOnlineTeachers(onlineTeachers))
    }, [])
    useEffect(() => {
        socket.once('updateOnlineTeachers', onlineTeachers => setOnlineTeachers(onlineTeachers))
    }, [onlineTeachers])
    useEffect(() => {
        socket.once('sendMessage', ({ content, teacher }) => {
            const previousMessage = messages[messages.length - 1]
            setMessages([
                ...messages,
                {
                    id: previousMessage ? previousMessage.id + 1 : 0,
                    content,
                    isTeacher: true,
                    teacher,
                    student: {}
                }
            ])
        })
    }, [messages])
    useEffect(() => {
        if (shouldMenuAppear) {
            setShouldParticipantsListAppear(false)
        }
    }, [shouldMenuAppear])
    useEffect(() => {
        if (messagesEnd.current) {
            setTimeout(() => {
                messagesEnd.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
            }, 700)
        }
    }, [messages])
    const sendMessage = async message => {
        if (message) {
            const previousMessage = messages[messages.length - 1]
            setMessages([
                ...messages,
                {
                    id: previousMessage ? previousMessage.id + 1 : 0,
                    content: message,
                    isTeacher: false,
                    teacher: {},
                    student: { id }
                }
            ])
            socket.emit('sendMessage', {
                content: message
            })
            setTimeout(() => {
                setMessage('')
            }, 0)
            try {
                const url = '/api/student/sendMessage'
                await axios.post(url, {
                    content: message
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
        <StudentChatContainer withMenu={shouldMenuAppear}>
            {!isLoading && (
                <>
                    <StyledMenu.Button
                        onClick={() => {
                            setShouldParticipantsListAppear(true)
                            setShouldMenuAppear(false)
                        }}
                        visible={!shouldParticipantsListAppear}
                        right
                    >
                        Lista nauczycieli
                    </StyledMenu.Button>
                    <TSCDashboard.ParticipantsList visible={shouldParticipantsListAppear}>
                        <HForm.CloseButton
                            onClick={() => {
                                setShouldParticipantsListAppear(false)
                            }}
                            left
                        />
                        <StyledMenu.OptionsContainer>
                            {teachers.map(({ id, email, name, surname }) => (
                                <TSCDashboard.ParticipantContainer key={id}>
                                    <TSCDashboard.Status
                                        online={onlineTeachers.some(teacher => teacher.id === id)}
                                    />
                                    <TSCDashboard.Participant>
                                        {`${name} ${surname}
                                        ( ${email} )`}
                                    </TSCDashboard.Participant>
                                </TSCDashboard.ParticipantContainer>
                            ))}
                        </StyledMenu.OptionsContainer>
                    </TSCDashboard.ParticipantsList>
                    <TSCDashboard.ChatContainer
                        shorter={shouldParticipantsListAppear}
                        withoutMessages={!messages.length > 0}
                    >
                        <TSCDashboard.MessagesContainer withoutMessages={!messages.length > 0}>
                            {messages.length > 0 ? (
                                messages.map(
                                    ({
                                        id: messageId,
                                        content,
                                        isTeacher,
                                        teacher: {
                                            email: teacherEmail,
                                            name: teacherName,
                                            surname: teacherSurname
                                        },
                                        student: {
                                            id: studentId,
                                            name: studentName,
                                            surname: studentSurname,
                                            nick: studentNick
                                        }
                                    }) =>
                                        !isTeacher ? (
                                            id === studentId ? (
                                                <TSCDashboard.Message key={messageId}>
                                                    Ty: <span>{content}</span>
                                                </TSCDashboard.Message>
                                            ) : (
                                                <TSCDashboard.Message key={messageId}>
                                                    {`${studentName} ${studentSurname} ( ${studentNick} ): `}
                                                    <span> {content}</span>
                                                </TSCDashboard.Message>
                                            )
                                        ) : (
                                            <TSCDashboard.Message key={messageId} withTeacher>
                                                {`Nauczyciel ${teacherName} ${teacherSurname} ( ${teacherEmail} ): `}
                                                <span>{content}</span>
                                            </TSCDashboard.Message>
                                        )
                                )
                            ) : (
                                <AHTLDashboard.Warning>
                                    W Twojej klasie nie ma jeszcze żadnej wiadomośći!
                                </AHTLDashboard.Warning>
                            )}
                            <div ref={messagesEnd}></div>
                        </TSCDashboard.MessagesContainer>
                        <TSCDashboard.MessageFieldContainer
                            onKeyPress={e => {
                                if (e.key === 'Enter') {
                                    sendMessage(message)
                                }
                            }}
                        >
                            <TSCDashboard.MessageField
                                value={message}
                                placeholder="Wpisz wiadomość..."
                                onChange={e => setMessage(e.target.value)}
                            />
                            <TSCDashboard.Submit onClick={() => sendMessage(message)}>
                                Wyślij
                            </TSCDashboard.Submit>
                        </TSCDashboard.MessageFieldContainer>
                    </TSCDashboard.ChatContainer>
                </>
            )}
        </StudentChatContainer>
    )
}

export default compose(withSocket, withMenu)(StudentChat)
