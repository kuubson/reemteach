import React, { useState } from 'react'
import styled, { css } from 'styled-components/macro'

import Form from '../styled/Form'

import Composed from '../composed'

const HeadTeacherFormContainer = styled(Form.FormsContainer)`
    top: 50%;
    left: 100%;
    transform: translate(0%, -50%);
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
    return (
        <HeadTeacherFormContainer shouldSlideIn={shouldSlideIn}>
            <Form.FormContainer>
                <Form.CloseButton onClick={onClick} />
                <Form.Form>
                    <Form.HeaderContainer>
                        <Form.Header>Dyrektor</Form.Header>
                        <Form.Annotation>Zaloguj się żeby zarządzać swoją szkołą</Form.Annotation>
                    </Form.HeaderContainer>
                    <Composed.Input
                        id="headTeacherEmail"
                        type="email"
                        label="E-mail"
                        value={email}
                        placeholder="Wprowadź adres e-mail..."
                        error={emailError}
                        onChange={setEmail}
                        trim
                    />
                    <Composed.Input
                        id="headTeacherPassword"
                        type="password"
                        label="Hasło"
                        value={password}
                        placeholder="Wprowadź hasło..."
                        error={passwordError}
                        onChange={setPassword}
                    />
                    <Form.Submit>Zaloguj się</Form.Submit>
                </Form.Form>
            </Form.FormContainer>
        </HeadTeacherFormContainer>
    )
}

export default HeadTeacherForm
