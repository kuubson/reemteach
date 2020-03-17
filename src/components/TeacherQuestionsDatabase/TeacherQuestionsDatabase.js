import React, { useEffect, useState } from 'react'
import styled from 'styled-components/macro'

import { compose } from 'redux'
import { withMenu, withTest } from '@hoc'

import APDashboard from '@components/AdminProfile/styled/Dashboard'
import AHTLDashboard from '@components/AdminHeadTeachersList/styled/Dashboard'
import TQMDashboard from '@components/TeacherQuestionsManager/styled/Dashboard'
import AHTCForm from '@components/AdminHeadTeacherCreator/styled/Form'
import HForm from '@components/Home/styled/Form'
import StyledFileInput from '@components/TeacherQuestionCreator/styled/FileInput'

import HTPComposed from '@components/HeadTeacherProfile/composed'
import HTSCComposed from '@components/HeadTeacherSchoolCreator/composed'

import { delayedApiAxios } from '@utils'

const TeacherQuestionsDatabaseContainer = styled(APDashboard.Container)`
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
`

const TeacherQuestionsDatabase = ({ shouldMenuAppear, test, setTest }) => {
    const [isLoading, setIsLoading] = useState(true)
    const [questions, setQuestions] = useState([])
    const [subjects, setSubjects] = useState([])
    const [chosenQuestions, setChosenQuestions] = useState([])
    useEffect(() => {
        const getAllQuestions = async () => {
            const url = '/api/teacher/getAllQuestions'
            const response = await delayedApiAxios.get(url)
            if (response) {
                setIsLoading(false)
                const { questions } = response.data
                setQuestions(
                    questions.map(question =>
                        test.some(({ id }) => id === question.id)
                            ? {
                                  ...question,
                                  isSelected: true
                              }
                            : question
                    )
                )
                setSubjects([...new Set(questions.map(({ subject }) => subject))])
            }
        }
        getAllQuestions()
    }, [])
    const setIsSelected = (id, isSelected) => {
        setQuestions(
            questions.map(question =>
                question.id === id
                    ? {
                          ...question,
                          isSelected
                      }
                    : question
            )
        )
        setChosenQuestions(
            chosenQuestions.map(question =>
                question.id === id
                    ? {
                          ...question,
                          isSelected
                      }
                    : question
            )
        )
    }
    return (
        <TeacherQuestionsDatabaseContainer withMenu={shouldMenuAppear}>
            {!isLoading &&
                (questions.length > 0 ? (
                    chosenQuestions.length > 0 ? (
                        <AHTLDashboard.DetailsContainer>
                            <HForm.CloseButton onClick={() => setChosenQuestions([])} black />
                            {chosenQuestions.map(
                                ({
                                    teacher: { email, name, surname },
                                    id,
                                    content,
                                    answerA,
                                    answerB,
                                    answerC,
                                    answerD,
                                    properAnswer,
                                    image,
                                    isSelected
                                }) => (
                                    <TQMDashboard.DetailOuterContainer
                                        key={id}
                                        selected={isSelected}
                                    >
                                        <HTPComposed.Detail
                                            label="Autor"
                                            value={`${name} ${surname} (${email})`}
                                        />
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
                                        <HTPComposed.Detail
                                            id="properAnswer"
                                            value={properAnswer}
                                        />
                                        <AHTLDashboard.ButtonsContainer>
                                            {isSelected ? (
                                                <AHTLDashboard.Button
                                                    onClick={() => {
                                                        setIsSelected(id, false)
                                                        setTest(
                                                            test.filter(
                                                                ({ id: questionId }) =>
                                                                    questionId !== id
                                                            )
                                                        )
                                                    }}
                                                >
                                                    Usuń z testu
                                                </AHTLDashboard.Button>
                                            ) : (
                                                <AHTLDashboard.Button
                                                    onClick={() => {
                                                        setIsSelected(id, true)
                                                        setTest([
                                                            ...test,
                                                            {
                                                                id
                                                            }
                                                        ])
                                                    }}
                                                >
                                                    Dodaj do testu
                                                </AHTLDashboard.Button>
                                            )}
                                        </AHTLDashboard.ButtonsContainer>
                                    </TQMDashboard.DetailOuterContainer>
                                )
                            )}
                        </AHTLDashboard.DetailsContainer>
                    ) : (
                        <>
                            <APDashboard.Header>Zaznacz przedmiot pytań</APDashboard.Header>
                            <AHTCForm.Form>
                                <HTSCComposed.Select
                                    id="subject"
                                    label="Przedmiot pytań"
                                    placeholder="Zaznacz przedmiot pytań..."
                                    options={subjects}
                                    onChange={subject => {
                                        setChosenQuestions(
                                            questions.filter(
                                                question => question.subject === subject
                                            )
                                        )
                                    }}
                                />
                            </AHTCForm.Form>
                        </>
                    )
                ) : (
                    <AHTLDashboard.Warning>
                        W bazie nie ma jeszcze żadnych pytań innych nauczycieli!
                    </AHTLDashboard.Warning>
                ))}
        </TeacherQuestionsDatabaseContainer>
    )
}

export default compose(withMenu, withTest)(TeacherQuestionsDatabase)
