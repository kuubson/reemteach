import React, { useState } from 'react'
import styled from 'styled-components/macro'

import { compose } from 'redux'
import { withMenu } from '@hoc'

import APDashboard from '@components/AdminProfile/styled/Dashboard'
import APMenu from '@components/AdminProfile/styled/Menu'
import Form from './styled/Form'

import APComposed from '@components/AdminProfile/composed'
import Composed from './composed'

import { redirectTo } from '@utils'

const AdminHeadTeacherCreatorContainer = styled(APDashboard.Container)`
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
`

const AdminHeadTeacherCreator = ({ shouldMenuAppear }) => {
    const [email, setEmail] = useState('')
    const [emailError, setEmailError] = useState('')
    return (
        <AdminHeadTeacherCreatorContainer withMenu={shouldMenuAppear}>
            <APComposed.Menu>
                <APMenu.Option onClick={() => redirectTo('/admin/profil')}>
                    Strona główna
                </APMenu.Option>
            </APComposed.Menu>
            <APDashboard.Header>Dodaj nowego dyrektora do systemu</APDashboard.Header>
            <Form.Form>
                <Composed.Input
                    id="headTeacherEmail"
                    label="E-mail"
                    value={email}
                    placeholder="Wprowadź adres e-mail..."
                    error={emailError}
                    onChange={setEmail}
                    trim
                />
                <Form.Submit>Dodaj dyrektora</Form.Submit>
            </Form.Form>
        </AdminHeadTeacherCreatorContainer>
    )
}

export default compose(withMenu)(AdminHeadTeacherCreator)
