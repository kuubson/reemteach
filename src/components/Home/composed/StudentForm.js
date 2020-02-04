import React, { useState } from 'react'
import styled, { css } from 'styled-components/macro'

import Form from '../styled/Form'

import Composed from '../composed'

const StudentFormContainer = styled(Form.FormsContainer)`
    top: 0%;
    left: 50%;
    transform: translate(-50%, calc(-100% - 5px));
    ${({ shouldSlideIn, flipped }) => {
        if (flipped)
            return css`
                top: 50%;
                transform: translate(-50%, -50%) rotateY(180deg);
            `
        if (shouldSlideIn)
            return css`
                top: 50%;
                transform: translate(-50%, -50%);
            `
    }}
`

const StudentForm = ({ onClick, shouldSlideIn }) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [emailError, setEmailError] = useState('')
    const [passwordError, setPasswordError] = useState('')
    return (
        <StudentFormContainer shouldSlideIn={shouldSlideIn}>
            <Form.FormContainer>
                <Form.CloseButton onClick={onClick} />
                <Form.Form>
                    <Form.HeaderContainer>
                        <Form.Header>Uczeń</Form.Header>
                    </Form.HeaderContainer>
                    <Composed.Input
                        id="studentEmail"
                        type="email"
                        label="E-mail"
                        value={email}
                        placeholder="Wprowadź adres e-mail..."
                        error={emailError}
                        onChange={setEmail}
                        trim
                    />
                    <Composed.Input
                        id="studentPassword"
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
        </StudentFormContainer>
    )
}

export default StudentForm
