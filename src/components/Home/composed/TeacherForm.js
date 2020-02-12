import React, { useState } from 'react'
import styled, { css } from 'styled-components/macro'
import validator from 'validator'

import Form from '../styled/Form'

import Composed from '../composed'

import { apiAxios, redirectTo } from '@utils'

const TeacherFormContainer = styled(Form.FormsContainer)`
    top: 50%;
    left: 0%;
    transform: translate(-100%, -50%);
    ${({ shouldSlideIn, flipped }) => {
        if (flipped)
            return css`
                left: 50%;
                transform: translate(-50%, -50%) rotateY(180deg);
            `
        if (shouldSlideIn)
            return css`
                left: 50%;
                transform: translate(-50%, -50%);
            `
    }}
`

const TeacherForm = ({ onClick, shouldSlideIn }) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [emailError, setEmailError] = useState('')
    const [passwordError, setPasswordError] = useState('')
    const validate = () => {
        setEmailError('')
        setPasswordError('')
        let isValidated = true
        if (!validator.isEmail(email) || !email) {
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
                const url = '/api/teacher/login'
                const response = await apiAxios.post(url, {
                    email,
                    password
                })
                if (response) {
                    redirectTo('/nauczyciel/profil')
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
        <TeacherFormContainer shouldSlideIn={shouldSlideIn}>
            <Form.FormContainer>
                <Form.CloseButton onClick={onClick} />
                <Form.Form onSubmit={handleSubmit}>
                    <Form.HeaderContainer>
                        <Form.Header>Nauczyciel</Form.Header>
                        <Form.Annotation>
                            Zaloguj się żeby zarządzać swoimi uczniami
                        </Form.Annotation>
                    </Form.HeaderContainer>
                    <Composed.Input
                        id="teacherEmail"
                        label="E-mail"
                        value={email}
                        placeholder="Wprowadź adres e-mail..."
                        error={emailError}
                        onChange={setEmail}
                        trim
                    />
                    <Composed.Input
                        id="teacherPassword"
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
        </TeacherFormContainer>
    )
}

export default TeacherForm
