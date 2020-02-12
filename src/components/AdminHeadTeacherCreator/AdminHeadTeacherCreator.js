import React, { useState } from 'react'
import styled from 'styled-components/macro'
import validator from 'validator'

import { compose } from 'redux'
import { withMenu } from '@hoc'

import APDashboard from '@components/AdminProfile/styled/Dashboard'
import APMenu from '@components/AdminProfile/styled/Menu'
import Form from './styled/Form'

import APComposed from '@components/AdminProfile/composed'
import Composed from './composed'

import { apiAxios, setFeedbackData, redirectTo } from '@utils'

const AdminHeadTeacherCreatorContainer = styled(APDashboard.Container)`
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
`

const AdminHeadTeacherCreator = ({ closeMenuOnClick, shouldMenuAppear }) => {
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
                const url = '/api/admin/createHeadTeacher'
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
        <AdminHeadTeacherCreatorContainer withMenu={shouldMenuAppear}>
            <APComposed.Menu>
                <APMenu.Option onClick={() => closeMenuOnClick(() => redirectTo('/admin/profil'))}>
                    Strona główna
                </APMenu.Option>
                <APMenu.Option
                    onClick={() => closeMenuOnClick(() => redirectTo('/admin/lista-dyrektorów'))}
                >
                    Lista dyrektorów
                </APMenu.Option>
            </APComposed.Menu>
            <APDashboard.Header>Utwórz nowego dyrektora w systemie</APDashboard.Header>
            <Form.Form onSubmit={handleSubmit}>
                <Composed.Input
                    id="headTeacherEmail"
                    label="E-mail"
                    value={email}
                    placeholder="Wprowadź adres e-mail..."
                    error={emailError}
                    onChange={setEmail}
                    trim
                />
                <Form.Submit>Utwórz dyrektora</Form.Submit>
            </Form.Form>
        </AdminHeadTeacherCreatorContainer>
    )
}

export default compose(withMenu)(AdminHeadTeacherCreator)
