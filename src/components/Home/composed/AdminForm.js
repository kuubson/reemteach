import React, { useState } from 'react'
import styled, { css } from 'styled-components/macro'
import validator from 'validator'

import Form from '../styled/Form'

import Composed from '../composed'

import { apiAxios, redirectTo } from '@utils'

const AdminFormContainer = styled(Form.FormsContainer)`
    top: 100%;
    left: 50%;
    transform: translate(-50%, calc(0% + 5px));
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

const AdminForm = ({ onClick, shouldSlideIn }) => {
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
                const url = '/api/admin/login'
                const response = await apiAxios.post(url, {
                    email,
                    password
                })
                if (response) {
                    redirectTo('/admin/profil')
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
        <AdminFormContainer shouldSlideIn={shouldSlideIn}>
            <Form.FormContainer>
                <Form.CloseButton onClick={onClick} />
                <Form.Form onSubmit={handleSubmit}>
                    <Form.HeaderContainer>
                        <Form.Header>Admin</Form.Header>
                        <Form.Annotation>
                            Zaloguj się żeby zarządzać dyrektorami szkół
                        </Form.Annotation>
                    </Form.HeaderContainer>
                    <Composed.Input
                        id="adminEmail"
                        label="E-mail"
                        value={email}
                        placeholder="Wprowadź adres e-mail..."
                        error={emailError}
                        onChange={setEmail}
                        trim
                    />
                    <Composed.Input
                        id="adminPassword"
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
        </AdminFormContainer>
    )
}

export default AdminForm
