import React, { useEffect, useState } from 'react'
import styled from 'styled-components/macro'

import { compose } from 'redux'
import { withMenu } from '@hoc'

import APDashboard from '@components/AdminProfile/styled/Dashboard'
import AHTCForm from '@components/AdminHeadTeacherCreator/styled/Form'
import StyledFileInput from './styled/FileInput'

import AHTCComposed from '@components/AdminHeadTeacherCreator/composed'
import HTSCComposed from '@components/HeadTeacherSchoolCreator/composed'
import Composed from './composed'

import {
    apiAxios,
    delayedApiAxios,
    redirectTo,
    delayedRedirectTo,
    setFeedbackData,
    detectSanitization
} from '@utils'

const TeacherQuestionCreatorContainer = styled(APDashboard.Container)`
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
`

const TeacherQuestionCreator = ({ shouldMenuAppear }) => {
    const [shouldScrollToError, setShouldScrollToError] = useState(false)
    const [subject, setSubject] = useState('')
    const [content, setContent] = useState('')
    const [answerA, setAnswerA] = useState('')
    const [answerB, setAnswerB] = useState('')
    const [answerC, setAnswerC] = useState('')
    const [answerD, setAnswerD] = useState('')
    const [properAnswer, setProperAnswer] = useState('')
    const [image, setImage] = useState()
    const [subjectError, setSubjectError] = useState()
    const [contentError, setContentError] = useState('')
    const [answerAError, setAnswerAError] = useState('')
    const [answerBError, setAnswerBError] = useState('')
    const [answerCError, setAnswerCError] = useState('')
    const [answerDError, setAnswerDError] = useState('')
    const [properAnswerError, setProperAnswerError] = useState('')
    useEffect(() => {
        const getSubject = async () => {
            const url = '/api/teacher/getSubject'
            const response = await delayedApiAxios.get(url)
            if (response) {
                const { subject } = response.data
                setSubject(subject)
            }
        }
        getSubject()
    }, [])
    useEffect(() => {
        if (shouldScrollToError) {
            document.querySelector('.error').scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
    }, [shouldScrollToError])
    const validate = () => {
        setShouldScrollToError()
        let isValidated = true
        switch (true) {
            case !subject:
                setSubjectError('Zaznacz przedmiot pytania!')
                isValidated = false
                break
            case detectSanitization(subject):
                setSubjectError('Przedmiot pytania zawiera niedozwolone znaki!')
                isValidated = false
                break
            default:
                setSubjectError('')
        }
        switch (true) {
            case !content:
                setContentError('Wprowadź treść pytania!')
                isValidated = false
                break
            case detectSanitization(content):
                setContentError('Treść pytania zawiera niedozwolone znaki!')
                isValidated = false
                break
            default:
                setContentError('')
        }
        switch (true) {
            case !answerA:
                setAnswerAError('Wprowadź odpowiedź A!')
                isValidated = false
                break
            case detectSanitization(answerA):
                setAnswerAError('Odpowiedź A zawiera niedozwolone znaki!')
                isValidated = false
                break
            default:
                setAnswerAError('')
        }
        switch (true) {
            case !answerB:
                setAnswerBError('Wprowadź odpowiedź B!')
                isValidated = false
                break
            case detectSanitization(answerB):
                setAnswerBError('Odpowiedź B zawiera niedozwolone znaki!')
                isValidated = false
                break
            default:
                setAnswerBError('')
        }
        switch (true) {
            case !answerC:
                setAnswerCError('Wprowadź odpowiedź C!')
                isValidated = false
                break
            case detectSanitization(answerC):
                setAnswerCError('Odpowiedź C zawiera niedozwolone znaki!')
                isValidated = false
                break
            default:
                setAnswerCError('')
        }
        switch (true) {
            case !answerD:
                setAnswerDError('Wprowadź odpowiedź D!')
                isValidated = false
                break
            case detectSanitization(answerD):
                setAnswerDError('Odpowiedź D zawiera niedozwolone znaki!')
                isValidated = false
                break
            default:
                setAnswerDError('')
        }
        switch (true) {
            case !properAnswer:
                setProperAnswerError('Zaznacz poprawną odpowiedź!')
                isValidated = false
                break
            case detectSanitization(properAnswer):
                setProperAnswerError('Poprawna odpowiedź zawiera niedozwolone znaki!')
                isValidated = false
                break
            default:
                setProperAnswerError('')
        }
        setTimeout(() => {
            setShouldScrollToError(!isValidated)
        }, 0)
        return isValidated
    }
    const handleSubmit = async e => {
        e.preventDefault()
        if (validate()) {
            try {
                const url = '/api/teacher/createQuestion'
                const data = new FormData()
                data.append('subject', subject)
                data.append('content', content)
                data.append('answerA', answerA)
                data.append('answerB', answerB)
                data.append('answerC', answerC)
                data.append('answerD', answerD)
                data.append('properAnswer', properAnswer)
                data.append('image', image)
                const response = await apiAxios.post(url, data)
                if (response) {
                    const { successMessage } = response.data
                    setFeedbackData(successMessage, 'Ok')
                    setContent('')
                    setAnswerA('')
                    setAnswerB('')
                    setAnswerC('')
                    setAnswerD('')
                    setProperAnswer('')
                    setImage()
                }
            } catch (error) {
                if (error.response) {
                    const { status, validationResults } = error.response.data
                    if (status === 422) {
                        setSubjectError('')
                        setContentError('')
                        setAnswerAError('')
                        setAnswerBError('')
                        setAnswerCError('')
                        setAnswerDError('')
                        setProperAnswerError('')
                        validationResults.forEach(({ parameter, error }) => {
                            if (parameter === 'subject') {
                                setSubjectError(error)
                            }
                            if (parameter === 'content') {
                                setContentError(error)
                            }
                            if (parameter === 'answerA') {
                                setAnswerAError(error)
                            }
                            if (parameter === 'answerB') {
                                setAnswerBError(error)
                            }
                            if (parameter === 'answerC') {
                                setAnswerCError(error)
                            }
                            if (parameter === 'answerD') {
                                setAnswerDError(error)
                            }
                            if (parameter === 'properAnswer') {
                                setProperAnswerError(error)
                            }
                        })
                    }
                }
            }
        }
    }
    return (
        <TeacherQuestionCreatorContainer withMenu={shouldMenuAppear} withMorePadding>
            <APDashboard.Header>Utwórz nowe pytanie w swojej bazie pytań</APDashboard.Header>
            <AHTCForm.Form onSubmit={handleSubmit}>
                <HTSCComposed.Select
                    id="subject"
                    label="Przedmiot pytania"
                    value={subject}
                    placeholder="Zaznacz przedmiot pytania..."
                    options={[
                        'Religia',
                        'Język polski',
                        'Język angielski',
                        'Język niemiecki',
                        'Język rosyjski',
                        'Język francuski',
                        'Matematyka',
                        'Fizyka',
                        'Biologia',
                        'Chemia',
                        'Geografia',
                        'Wiedza o społeczeństwie',
                        'Historia',
                        'Informatyka'
                    ]}
                    error={subjectError}
                    onChange={setSubject}
                />
                <AHTCComposed.Input
                    id="content"
                    label="Treść pytania"
                    value={content}
                    placeholder="Wprowadź treść pytania..."
                    error={contentError}
                    onChange={setContent}
                />
                <AHTCComposed.Input
                    id="answerA"
                    label="Odpowiedź A"
                    value={answerA}
                    placeholder="Wprowadź odpowiedź A..."
                    error={answerAError}
                    onChange={setAnswerA}
                    textarea
                />
                <AHTCComposed.Input
                    id="answerB"
                    label="Odpowiedź B"
                    value={answerB}
                    placeholder="Wprowadź odpowiedź B..."
                    error={answerBError}
                    onChange={setAnswerB}
                    textarea
                />
                <AHTCComposed.Input
                    id="answerC"
                    label="Odpowiedź C"
                    value={answerC}
                    placeholder="Wprowadź odpowiedź C..."
                    error={answerCError}
                    onChange={setAnswerC}
                    textarea
                />
                <AHTCComposed.Input
                    id="answerD"
                    label="Odpowiedź D"
                    value={answerD}
                    placeholder="Wprowadź odpowiedź D..."
                    error={answerDError}
                    onChange={setAnswerD}
                    textarea
                />
                <HTSCComposed.Select
                    id="properAnswer"
                    label="Poprawna odpowiedź"
                    value={properAnswer}
                    placeholder="Zaznacz poprawną odpowiedź..."
                    options={['A', 'B', 'C', 'D']}
                    error={properAnswerError}
                    onChange={setProperAnswer}
                />
                {image && (
                    <StyledFileInput.ImageContainer>
                        <StyledFileInput.Image src={URL.createObjectURL(image)} />
                    </StyledFileInput.ImageContainer>
                )}
                <Composed.FileInput
                    id="image"
                    label="Zdjęcie ( opcjonalne )"
                    buttonText="Dodaj zdjęcie"
                    image={image}
                    onChange={setImage}
                />
                <AHTCForm.Submit>Utwórz pytanie</AHTCForm.Submit>
            </AHTCForm.Form>
        </TeacherQuestionCreatorContainer>
    )
}

export default compose(withMenu)(TeacherQuestionCreator)
