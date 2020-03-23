import React, { useEffect, useState } from 'react'
import styled from 'styled-components/macro'

import { compose } from 'redux'
import { withSocket, withMenu } from '@hoc'

import APDashboard from '@components/AdminProfile/styled/Dashboard'
import AHTLDashboard from '@components/AdminHeadTeachersList/styled/Dashboard'
import TQMDashboard from '@components/TeacherQuestionsManager/styled/Dashboard'
import AHTCForm from '@components/AdminHeadTeacherCreator/styled/Form'
import StyledFileInput from '@components/TeacherQuestionCreator/styled/FileInput'
import StyledMenu from '@components/AdminProfile/styled/Menu'

import HTPComposed from '@components/HeadTeacherProfile/composed'
import HTSCComposed from '@components/HeadTeacherSchoolCreator/composed'

import { apiAxios, setFeedbackData } from '@utils'

const StudentTestContainer = styled(APDashboard.Container)`
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
`

const StudentTest = ({ socket, shouldMenuAppear }) => {
    const [testMode, setTestMode] = useState('')
    const [questions, setQuestions] = useState([])
    const [teacherId, setTeacherId] = useState('')
    const [grade, setGrade] = useState('')
    useEffect(() => {
        socket.once('sendTest', ({ teacherId, teacher, questions }) => {
            setFeedbackData(
                `Nauczyciel ${teacher} przesłał Ci test z liczbą pytań wynoszącą: ${questions.length}!`,
                'Ok'
            )
            setTeacherId(teacherId)
            const shuffleArray = array => {
                for (let i = array.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1))
                    const temp = array[i]
                    array[i] = array[j]
                    array[j] = temp
                }
                return array
            }
            setQuestions(shuffleArray(questions))
            socket.emit('receiveTest')
        })
        socket.emit('joinTest')
        return () => socket.emit('leaveTest')
    }, [])
    const updateQuestions = (id, answer) =>
        setQuestions(
            questions.map(question =>
                question.id === id
                    ? {
                          ...question,
                          answer,
                          error: ''
                      }
                    : question
            )
        )
    const validate = () => {
        let isValidated = true
        setQuestions(
            questions.map(question => {
                if (!question.answer) {
                    isValidated = false
                    return {
                        ...question,
                        error: 'Zaznacz Twoją odpowiedź!'
                    }
                } else {
                    return {
                        ...question,
                        error: ''
                    }
                }
            })
        )
        setTimeout(() => {
            if (!isValidated) {
                document
                    .querySelector('.error')
                    .scrollIntoView({ behavior: 'smooth', block: 'center' })
            }
        }, 0)
        return isValidated
    }
    const finishTest = async () => {
        if (validate()) {
            const url = '/api/student/finishTest'
            const response = await apiAxios.post(url, {
                teacherId,
                questions
            })
            if (response) {
                const { grade } = response.data
                setGrade(grade)
                setQuestions([])
                window.scrollTo(0, 0)
            }
        }
    }
    return (
        <StudentTestContainer withMenu={shouldMenuAppear}>
            {grade ? (
                <AHTLDashboard.Warning>Otrzymałeś ocenę {grade} z testu!</AHTLDashboard.Warning>
            ) : testMode ? (
                questions.length > 0 ? (
                    <AHTLDashboard.DetailsContainer>
                        <StyledMenu.Button onClick={finishTest} visible right>
                            Zakończ
                        </StyledMenu.Button>
                        {questions.map(
                            ({
                                id,
                                content,
                                answerA,
                                answerB,
                                answerC,
                                answerD,
                                image,
                                answer,
                                error
                            }) => (
                                <TQMDashboard.DetailOuterContainer key={id}>
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
                                    <HTSCComposed.Select
                                        id={`${content}${id}`}
                                        label="Twoja odpowiedź"
                                        value={answer}
                                        placeholder="Zaznacz Twoją odpowiedź..."
                                        options={['A', 'B', 'C', 'D']}
                                        error={error}
                                        onChange={answer => updateQuestions(id, answer)}
                                        withoutPadding
                                        shorter
                                    />
                                </TQMDashboard.DetailOuterContainer>
                            )
                        )}
                    </AHTLDashboard.DetailsContainer>
                ) : (
                    <AHTLDashboard.Warning>
                        Nie otrzymałeś jeszcze testu od nauczyciela!
                    </AHTLDashboard.Warning>
                )
            ) : (
                <>
                    <APDashboard.Header>Zaznacz sposób rozwiązywania testu</APDashboard.Header>
                    <AHTCForm.Form>
                        <HTSCComposed.Select
                            id="testMode"
                            label="Sposób rozwiązywania testu"
                            placeholder="Zaznacz sposób rozwiązywania testu..."
                            options={['Standardowy']}
                            onChange={setTestMode}
                        />
                    </AHTCForm.Form>
                </>
            )}
        </StudentTestContainer>
    )
}

export default compose(withSocket, withMenu)(StudentTest)
