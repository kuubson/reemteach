import React, { useState } from 'react'
import styled, { css } from 'styled-components/macro'
import validator from 'validator'

import Form from '../styled/Form'

import Composed from '../composed'

import { apiAxios, redirectTo } from 'utils'

const HeadTeacherFormContainer = styled(Form.FormsContainer)`
    top: 50%;
    left: 100%;
    transform: translate(calc(0% + 15px), -50%);
    ${({ shouldSlideIn }) => {
        if (shouldSlideIn)
            return css`
                left: 50%;
                transform: translate(-50%, -50%);
            `
    }}
`

const HeadTeacherForm = ({ onClick, shouldSlideIn }) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [emailError, setEmailError] = useState('')
    const [passwordError, setPasswordError] = useState('')
    const validate = () => {
        setEmailError('')
        setPasswordError('')
        let isValidated = true
        if (!email || !validator.isEmail(email)) {
            setEmailError('Wprowadź poprawny adres e-mail!')
            isValidated = false
        }
        if (!password) {
            setPasswordError('Wprowadź hasło!')
            isValidated = false
        }
        return isValidated
    }
    const handleSubmit = async e => {
        e.preventDefault()
        if (validate()) {
            try {
                const url = '/api/headTeacher/login'
                const response = await apiAxios.post(url, {
                    email,
                    password
                })
                if (response) {
                    redirectTo('/dyrektor/profil')
                }
            } catch (error) {
                if (error.response) {
                    const { status, validationResults } = error.response.data
                    if (status === 422) {
                        setEmailError('')
                        setPasswordError('')
                        validationResults.forEach(({ parameter, error }) => {
                            if (parameter === 'email') {
                                setEmailError(error)
                            }
                            if (parameter === 'password') {
                                setPasswordError(error)
                            }
                        })
                    }
                }
            }
        }
    }
    return (
        <HeadTeacherFormContainer shouldSlideIn={shouldSlideIn}>
            <Form.FormContainer>
                <Form.CloseButton onClick={onClick} />
                <Form.Form onSubmit={handleSubmit}>
                    <Form.HeaderContainer>
                        <Form.Header>Dyrektor</Form.Header>
                        <Form.Annotation>Zaloguj się żeby zarządzać swoją szkołą</Form.Annotation>
                    </Form.HeaderContainer>
                    <Composed.Input
                        id="headTeacherEmail"
                        label="E-mail"
                        value={email}
                        placeholder="Wprowadź adres e-mail..."
                        error={emailError}
                        onChange={setEmail}
                        trim
                    />
                    <Composed.Input
                        id="headTeacherPassword"
                        label="Hasło"
                        value={password}
                        placeholder="Wprowadź hasło..."
                        error={passwordError}
                        onChange={setPassword}
                        secure
                    />
                    <Form.Submit>Zaloguj się</Form.Submit>
                </Form.Form>
            </Form.FormContainer>
        </HeadTeacherFormContainer>
    )
}

export default HeadTeacherForm
