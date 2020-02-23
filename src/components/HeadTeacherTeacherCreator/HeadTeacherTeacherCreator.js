import React, { useState } from 'react'
import styled from 'styled-components/macro'
import validator from 'validator'

import { compose } from 'redux'
import { withMenu } from '@hoc'

import APDashboard from '@components/AdminProfile/styled/Dashboard'
import AHTCForm from '@components/AdminHeadTeacherCreator/styled/Form'

import AHTCComposed from '@components/AdminHeadTeacherCreator/composed'

import { apiAxios, setFeedbackData } from '@utils'

const HeadTeacherTeacherCreatorContainer = styled(APDashboard.Container)`
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
`

const HeadTeacherTeacherCreator = ({ shouldMenuAppear }) => {
    const [email, setEmail] = useState('')
    const [emailError, setEmailError] = useState('')
    const validate = () => {
        setEmailError('')
        let isValidated = true
        if (!email || !validator.isEmail(email)) {
            setEmailError('Wprowadź poprawny adres e-mail!')
            isValidated = false
        }
        return isValidated
    }
    const handleSubmit = async e => {
        e.preventDefault()
        if (validate()) {
            try {
                const url = '/api/headTeacher/createTeacher'
                const response = await apiAxios.post(url, {
                    email
                })
                if (response) {
                    const { successMessage } = response.data
                    setFeedbackData(successMessage, 'Ok')
                }
            } catch (error) {
                if (error.response) {
                    const { status, validationResults } = error.response.data
                    if (status === 422) {
                        setEmailError('')
                        validationResults.forEach(({ parameter, error }) => {
                            if (parameter === 'email') {
                                setEmailError(error)
                            }
                        })
                    }
                }
            }
        }
    }
    return (
        <HeadTeacherTeacherCreatorContainer withMenu={shouldMenuAppear} withMorePadding>
            <APDashboard.Header>Utwórz nowego nauczyciela w szkole</APDashboard.Header>
            <AHTCForm.Form onSubmit={handleSubmit}>
                <AHTCComposed.Input
                    id="email"
                    label="E-mail"
                    value={email}
                    placeholder="Wprowadź adres e-mail..."
                    error={emailError}
                    onChange={setEmail}
                    trim
                />
                <AHTCForm.Submit>Utwórz nauczyciela</AHTCForm.Submit>
            </AHTCForm.Form>
        </HeadTeacherTeacherCreatorContainer>
    )
}

export default compose(withMenu)(HeadTeacherTeacherCreator)
