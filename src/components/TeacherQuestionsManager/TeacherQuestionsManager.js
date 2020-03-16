import React, { useEffect, useState } from 'react'
import styled from 'styled-components/macro'

import { compose } from 'redux'
import { withMenu } from '@hoc'

import APDashboard from '@components/AdminProfile/styled/Dashboard'
import AHTLDashboard from '@components/AdminHeadTeachersList/styled/Dashboard'
import AHTCForm from '@components/AdminHeadTeacherCreator/styled/Form'
import HForm from '@components/Home/styled/Form'
import StyledFileInput from '@components/TeacherQuestionCreator/styled/FileInput'

import HTPComposed from '@components/HeadTeacherProfile/composed'
import HTSCComposed from '@components/HeadTeacherSchoolCreator/composed'
import TQCComposed from '@components/TeacherQuestionCreator/composed'

import {
    apiAxios,
    delayedApiAxios,
    setFeedbackData,
    setConfirmationPopupData,
    detectSanitization
} from '@utils'

const TeacherQuestionsManagerContainer = styled(APDashboard.Container)`
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
`

const TeacherQuestionsManager = ({ shouldMenuAppear }) => {
    const [isLoading, setIsLoading] = useState(true)
    const [questions, setQuestions] = useState([])
    const [subjects, setSubjects] = useState([])
    const [chosenQuestions, setChosenQuestions] = useState([])
    useEffect(() => {
        const getQuestions = async () => {
            const url = '/api/teacher/getQuestions'
            const response = await delayedApiAxios.get(url)
            if (response) {
                setIsLoading(false)
                const { questions } = response.data
                setQuestions(questions)
            }
        }
        getQuestions()
    }, [])
    useEffect(() => {
        setSubjects([...new Set(questions.map(({ subject }) => subject))])
    }, [questions])
    const updateQuestions = (
        id,
        key,
        value,
        errorKey,
        errorValue,
        initialImage,
        newImage,
        shouldSaveButtonAppear
    ) => {
        setQuestions(
            questions.map(question =>
                question.id === id
                    ? {
                          ...question,
                          [key]: value,
                          [errorKey]: errorValue,
                          initialImage,
                          newImage,
                          shouldSaveButtonAppear
                      }
                    : question
            )
        )
        setChosenQuestions(
            chosenQuestions.map(question =>
                question.id === id
                    ? {
                          ...question,
                          [key]: value,
                          [errorKey]: errorValue,
                          initialImage,
                          newImage,
                          shouldSaveButtonAppear
                      }
                    : question
            )
        )
    }
    const validateQuestion = (content, answerA, answerB, answerC, answerD, properAnswer) =>
        content &&
        !detectSanitization(content) &&
        answerA &&
        !detectSanitization(answerA) &&
        answerB &&
        !detectSanitization(answerB) &&
        answerC &&
        !detectSanitization(answerC) &&
        answerD &&
        !detectSanitization(answerD) &&
        properAnswer &&
        !detectSanitization(properAnswer)
    const updateQuestion = async (
        id,
        content,
        answerA,
        answerB,
        answerC,
        answerD,
        properAnswer,
        initialImage,
        image,
        newImage
    ) => {
        const url = '/api/teacher/updateQuestion'
        const data = new FormData()
        data.append('id', id)
        data.append('content', content)
        data.append('answerA', answerA)
        data.append('answerB', answerB)
        data.append('answerC', answerC)
        data.append('answerD', answerD)
        data.append('properAnswer', properAnswer)
        data.append('image', initialImage)
        data.append('newImage', newImage)
        const response = await apiAxios.post(url, data)
        if (response) {
            const { successMessage } = response.data
            setFeedbackData(successMessage, 'Ok')
            updateQuestions(id, 'image', image, 'imageError', '', initialImage, undefined, false)
        }
    }
    const destroyQuestion = id => {
        setConfirmationPopupData(
            `Czy napewno chcesz usunąć pytanie o id ${id} z Twojej bazy pytań?`,
            'Tak',
            'Nie',
            async () => {
                const url = '/api/teacher/destroyQuestion'
                const response = await apiAxios.post(url, {
                    id
                })
                if (response) {
                    const { successMessage } = response.data
                    setFeedbackData(successMessage, 'Ok')
                    setQuestions(questions.filter(question => question.id !== id))
                    setChosenQuestions(chosenQuestions.filter(question => question.id !== id))
                }
            }
        )
    }
    return (
        <TeacherQuestionsManagerContainer withMenu={shouldMenuAppear} withMorePadding>
            {!isLoading && (
                <>
                    {questions.length > 0 ? (
                        <>
                            {chosenQuestions.length > 0 ? (
                                <AHTLDashboard.DetailsContainer>
                                    <HForm.CloseButton
                                        onClick={() => setChosenQuestions([])}
                                        black
                                    />
                                    {chosenQuestions.map(
                                        ({
                                            id,
                                            content,
                                            answerA,
                                            answerB,
                                            answerC,
                                            answerD,
                                            properAnswer,
                                            contentError,
                                            answerAError,
                                            answerBError,
                                            answerCError,
                                            answerDError,
                                            properAnswerError,
                                            initialImage,
                                            image,
                                            newImage,
                                            shouldSaveButtonAppear
                                        }) => (
                                            <div key={id}>
                                                <HTPComposed.Detail label="Id pytania" value={id} />
                                                <>
                                                    {image && (
                                                        <StyledFileInput.ImageContainer>
                                                            <StyledFileInput.Image src={image} />
                                                            <HForm.CloseButton
                                                                onClick={() =>
                                                                    updateQuestions(
                                                                        id,
                                                                        'image',
                                                                        undefined,
                                                                        'imageError',
                                                                        '',
                                                                        '',
                                                                        undefined,
                                                                        validateQuestion(
                                                                            content,
                                                                            answerA,
                                                                            answerB,
                                                                            answerC,
                                                                            answerD,
                                                                            properAnswer
                                                                        )
                                                                    )
                                                                }
                                                                withBoxShadow
                                                            />
                                                        </StyledFileInput.ImageContainer>
                                                    )}
                                                    <TQCComposed.FileInput
                                                        id={id}
                                                        buttonText={
                                                            image
                                                                ? 'Zmień zdjęcie'
                                                                : 'Dodaj zdjęcie'
                                                        }
                                                        image={newImage}
                                                        onChange={newImage => {
                                                            updateQuestions(
                                                                id,
                                                                'image',
                                                                newImage
                                                                    ? URL.createObjectURL(newImage)
                                                                    : initialImage,
                                                                'imageError',
                                                                '',
                                                                initialImage,
                                                                newImage,
                                                                validateQuestion(
                                                                    content,
                                                                    answerA,
                                                                    answerB,
                                                                    answerC,
                                                                    answerD,
                                                                    properAnswer
                                                                )
                                                            )
                                                        }}
                                                    />
                                                </>
                                                <HTPComposed.EditableDetail
                                                    label="Treść pytania"
                                                    value={content}
                                                    error={contentError}
                                                    onChange={content =>
                                                        updateQuestions(
                                                            id,
                                                            'content',
                                                            content,
                                                            'contentError',
                                                            !content
                                                                ? 'Wprowadź treść pytania!'
                                                                : detectSanitization(content)
                                                                ? 'Treść pytania zawiera niedozwolone znaki!'
                                                                : '',
                                                            initialImage,
                                                            newImage,
                                                            validateQuestion(
                                                                content,
                                                                answerA,
                                                                answerB,
                                                                answerC,
                                                                answerD,
                                                                properAnswer
                                                            )
                                                        )
                                                    }
                                                    textarea
                                                />
                                                <HTPComposed.EditableDetail
                                                    label="Odpowiedź A"
                                                    value={answerA}
                                                    error={answerAError}
                                                    onChange={answerA =>
                                                        updateQuestions(
                                                            id,
                                                            'answerA',
                                                            answerA,
                                                            'answerAError',
                                                            !answerA
                                                                ? 'Wprowadź odpowiedź A!'
                                                                : detectSanitization(answerA)
                                                                ? 'Odpowiedź A zawiera niedozwolone znaki!'
                                                                : '',
                                                            initialImage,
                                                            newImage,
                                                            validateQuestion(
                                                                content,
                                                                answerA,
                                                                answerB,
                                                                answerC,
                                                                answerD,
                                                                properAnswer
                                                            )
                                                        )
                                                    }
                                                    textarea
                                                />
                                                <HTPComposed.EditableDetail
                                                    label="Odpowiedź B"
                                                    value={answerB}
                                                    error={answerBError}
                                                    onChange={answerB =>
                                                        updateQuestions(
                                                            id,
                                                            'answerB',
                                                            answerB,
                                                            'answerBError',
                                                            !answerB
                                                                ? 'Wprowadź odpowiedź B!'
                                                                : detectSanitization(answerB)
                                                                ? 'Odpowiedź B zawiera niedozwolone znaki!'
                                                                : '',
                                                            initialImage,
                                                            newImage,
                                                            validateQuestion(
                                                                content,
                                                                answerA,
                                                                answerB,
                                                                answerC,
                                                                answerD,
                                                                properAnswer
                                                            )
                                                        )
                                                    }
                                                    textarea
                                                />
                                                <HTPComposed.EditableDetail
                                                    label="Odpowiedź C"
                                                    value={answerC}
                                                    error={answerCError}
                                                    onChange={answerC =>
                                                        updateQuestions(
                                                            id,
                                                            'answerC',
                                                            answerC,
                                                            'answerCError',
                                                            !answerC
                                                                ? 'Wprowadź odpowiedź C!'
                                                                : detectSanitization(answerC)
                                                                ? 'Odpowiedź C zawiera niedozwolone znaki!'
                                                                : '',
                                                            initialImage,
                                                            newImage,
                                                            validateQuestion(
                                                                content,
                                                                answerA,
                                                                answerB,
                                                                answerC,
                                                                answerD,
                                                                properAnswer
                                                            )
                                                        )
                                                    }
                                                    textarea
                                                />
                                                <HTPComposed.EditableDetail
                                                    label="Odpowiedź D"
                                                    value={answerD}
                                                    error={answerDError}
                                                    onChange={answerD =>
                                                        updateQuestions(
                                                            id,
                                                            'answerD',
                                                            answerD,
                                                            'answerDError',
                                                            !answerD
                                                                ? 'Wprowadź odpowiedź D!'
                                                                : detectSanitization(answerD)
                                                                ? 'Odpowiedź D zawiera niedozwolone znaki!'
                                                                : '',
                                                            initialImage,
                                                            newImage,
                                                            validateQuestion(
                                                                content,
                                                                answerA,
                                                                answerB,
                                                                answerC,
                                                                answerD,
                                                                properAnswer
                                                            )
                                                        )
                                                    }
                                                    textarea
                                                />
                                                <HTPComposed.EditableDetail
                                                    id="properAnswer"
                                                    label="Poprawna odpowiedź"
                                                    value={properAnswer}
                                                    placeholder="Zaznacz poprawną odpowiedź..."
                                                    options={['A', 'B', 'C', 'D']}
                                                    error={properAnswerError}
                                                    onChange={properAnswer =>
                                                        updateQuestions(
                                                            id,
                                                            'properAnswer',
                                                            properAnswer,
                                                            'properAnswerError',
                                                            !properAnswer
                                                                ? 'Zaznacz poprawną odpowiedź!'
                                                                : detectSanitization(properAnswer)
                                                                ? 'Poprawna odpowiedź zawiera niedozwolone znaki!'
                                                                : '',
                                                            initialImage,
                                                            newImage,
                                                            validateQuestion(
                                                                content,
                                                                answerA,
                                                                answerB,
                                                                answerC,
                                                                answerD,
                                                                properAnswer
                                                            )
                                                        )
                                                    }
                                                    select
                                                />
                                                <AHTLDashboard.ButtonsContainer>
                                                    {shouldSaveButtonAppear && (
                                                        <AHTLDashboard.Button
                                                            onClick={() =>
                                                                updateQuestion(
                                                                    id,
                                                                    content,
                                                                    answerA,
                                                                    answerB,
                                                                    answerC,
                                                                    answerD,
                                                                    properAnswer,
                                                                    initialImage,
                                                                    image,
                                                                    newImage
                                                                )
                                                            }
                                                        >
                                                            Zapisz
                                                        </AHTLDashboard.Button>
                                                    )}
                                                    <AHTLDashboard.Button
                                                        onClick={() => destroyQuestion(id)}
                                                    >
                                                        Usuń
                                                    </AHTLDashboard.Button>
                                                </AHTLDashboard.ButtonsContainer>
                                            </div>
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
                            )}
                        </>
                    ) : (
                        <AHTLDashboard.Warning>
                            Nie masz jeszcze żadnego własnego pytania!
                        </AHTLDashboard.Warning>
                    )}
                </>
            )}
        </TeacherQuestionsManagerContainer>
    )
}

export default compose(withMenu)(TeacherQuestionsManager)
