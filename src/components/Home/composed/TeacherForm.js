import React, { useState } from 'react'
import styled, { css } from 'styled-components/macro'

import Form from '../styled/Form'

import Composed from '../composed'

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
    return (
        <TeacherFormContainer shouldSlideIn={shouldSlideIn}>
            <Form.FormContainer>
                <Form.CloseButton onClick={onClick} />
                <Form.Form>
                    <Form.HeaderContainer>
                        <Form.Header>Nauczyciel</Form.Header>
                        <Form.Annotation>
                            Zaloguj się żeby zarządzać swoimi uczniami
                        </Form.Annotation>
                    </Form.HeaderContainer>
                    <Composed.Input
                        id="teacherEmail"
                        type="email"
                        label="E-mail"
                        value={email}
                        placeholder="Wprowadź adres e-mail..."
                        error={emailError}
                        onChange={setEmail}
                        trim
                    />
                    <Composed.Input
                        id="teacherPassword"
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
        </TeacherFormContainer>
    )
}

export default TeacherForm
