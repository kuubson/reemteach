import React, { useEffect, useState } from 'react'
import styled from 'styled-components/macro'

import { compose } from 'redux'
import { withMenu } from '@hoc'

import APDashboard from '@components/AdminProfile/styled/Dashboard'
import AHTCForm from '@components/AdminHeadTeacherCreator/styled/Form'

import AHTCComposed from '@components/AdminHeadTeacherCreator/composed'

import { apiAxios, setFeedbackData, detectSanitization } from '@utils'

const HeadTeacherNewsCreatorContainer = styled(APDashboard.Container)`
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
`

const HeadTeacherNewsCreator = ({ shouldMenuAppear }) => {
    const [shouldScrollToError, setShouldScrollToError] = useState(false)
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [titleError, setTitleError] = useState('')
    const [contentError, setContentError] = useState('')
    useEffect(() => {
        if (shouldScrollToError) {
            document.querySelector('.error').scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
    }, [shouldScrollToError])
    const validate = () => {
        setShouldScrollToError()

        let isValidated = true
        switch (true) {
            case !title:
                setTitleError('Wprowadź tytuł wiadomości!')
                isValidated = false
                break
            case detectSanitization(title):
                setTitleError('Tytuł wiadomości zawiera niedozwolone znaki!')
                isValidated = false
                break
            default:
                setTitleError('')
        }
        switch (true) {
            case !content:
                setContentError('Wprowadź treść wiadomości!')
                isValidated = false
                break
            case detectSanitization(content):
                setContentError('Treść wiadomości zawiera niedozwolone znaki!')
                isValidated = false
                break
            default:
                setContentError('')
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
                const url = '/api/headTeacher/createNews'
                const response = await apiAxios.post(url, {
                    title,
                    content
                })
                if (response) {
                    const { successMessage } = response.data
                    setFeedbackData(successMessage, 'Ok')
                    setTitle('')
                    setContent('')
                }
            } catch (error) {
                if (error.response) {
                    const { status, validationResults } = error.response.data
                    if (status === 422) {
                        setTitleError('')
                        setContentError('')
                        validationResults.forEach(({ parameter, error }) => {
                            if (parameter === 'title') {
                                setTitleError(error)
                            }
                            if (parameter === 'content') {
                                setContentError(error)
                            }
                        })
                    }
                }
            }
        }
    }
    return (
        <HeadTeacherNewsCreatorContainer withMenu={shouldMenuAppear}>
            <APDashboard.Header>Utwórz nową aktualność w szkole</APDashboard.Header>
            <AHTCForm.Form onSubmit={handleSubmit}>
                <AHTCComposed.Input
                    id="title"
                    label="Tytuł wiadomości"
                    value={title}
                    placeholder="Wprowadź tytuł wiadomości..."
                    error={titleError}
                    onChange={setTitle}
                />
                <AHTCComposed.Input
                    id="content"
                    label="Treść wiadomości"
                    value={content}
                    placeholder="Wprowadź treść wiadomości..."
                    error={contentError}
                    onChange={setContent}
                    textarea
                />

                <AHTCForm.Submit>Utwórz aktualność</AHTCForm.Submit>
            </AHTCForm.Form>
        </HeadTeacherNewsCreatorContainer>
    )
}

export default compose(withMenu)(HeadTeacherNewsCreator)
