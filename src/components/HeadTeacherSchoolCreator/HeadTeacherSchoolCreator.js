import React, { useState } from 'react'
import styled from 'styled-components/macro'

import { compose } from 'redux'
import { withMenu } from '@hoc'

import APDashboard from '@components/AdminProfile/styled/Dashboard'
import APMenu from '@components/AdminProfile/styled/Menu'
import AHDCForm from '@components/AdminHeadTeacherCreator/styled/Form'

import APComposed from '@components/AdminProfile/composed'
import AHTCComposed from '@components/AdminHeadTeacherCreator/composed'

import { apiAxios, redirectTo, setFeedbackData } from '@utils'

const HeadTeacherSchoolCreatorContainer = styled(APDashboard.Container)`
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
`

const HeadTeacherSchoolCreator = ({ closeMenuOnClick, shouldMenuAppear }) => {
    const [name, setName] = useState('')
    const [nameError, setNameError] = useState('')
    const validate = () => {
        setNameError('')
        let isValidated = true
        if (!name) {
            setNameError('Wprowadź nazwę szkoły!')
            isValidated = false
        }
        return isValidated
    }
    const handleSubmit = async e => {
        e.preventDefault()
        if (validate()) {
            try {
                const url = '/api/headTeacher/createSchool'
                const response = await apiAxios.post(url, {
                    name
                })
                if (response) {
                    const { successMessage } = response.data
                    setFeedbackData(successMessage, 'Ok')
                }
            } catch (error) {
                if (error.response) {
                    const { status, validationResults } = error.response.data
                    if (status === 422) {
                        setNameError('')
                        validationResults.forEach(({ parameter, error }) => {
                            if (parameter === 'name') {
                                setNameError(error)
                            }
                        })
                    }
                }
            }
        }
    }
    return (
        <HeadTeacherSchoolCreatorContainer withMenu={shouldMenuAppear} morePadding>
            <APComposed.Menu>
                <APMenu.Option
                    onClick={() => closeMenuOnClick(() => redirectTo('/dyrektor/profil'))}
                >
                    Strona główna
                </APMenu.Option>
            </APComposed.Menu>
            <APDashboard.Header>Utwórz nową szkołę w systemie</APDashboard.Header>
            <AHDCForm.Form onSubmit={handleSubmit}>
                <AHTCComposed.Input
                    id="name"
                    label="Nazwa szkoły"
                    value={name}
                    placeholder="Wprowadź nazwę szkoły..."
                    error={nameError}
                    onChange={setName}
                />
                <AHDCForm.Submit>Utwórz szkołę</AHDCForm.Submit>
            </AHDCForm.Form>
        </HeadTeacherSchoolCreatorContainer>
    )
}

export default compose(withMenu)(HeadTeacherSchoolCreator)
