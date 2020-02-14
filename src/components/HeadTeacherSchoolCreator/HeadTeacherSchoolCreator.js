import React, { useEffect, useState } from 'react'
import styled from 'styled-components/macro'
import moment from 'moment'

import { compose } from 'redux'
import { withMenu } from '@hoc'

import APDashboard from '@components/AdminProfile/styled/Dashboard'
import APMenu from '@components/AdminProfile/styled/Menu'
import AHTCForm from '@components/AdminHeadTeacherCreator/styled/Form'

import APComposed from '@components/AdminProfile/composed'
import AHTCComposed from '@components/AdminHeadTeacherCreator/composed'
import Composed from './composed'

import { apiAxios, redirectTo, setFeedbackData } from '@utils'

const HeadTeacherSchoolCreatorContainer = styled(APDashboard.Container)`
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
`

const HeadTeacherSchoolCreator = ({ closeMenuOnClick, shouldMenuAppear }) => {
    const [shouldScrollToError, setShouldScrollToError] = useState(false)
    const [name, setName] = useState('')
    const [type, setType] = useState('')
    const [creationDate, setCreationDate] = useState('')
    const [description, setDescription] = useState('')
    const [nameError, setNameError] = useState('')
    const [typeError, setTypeError] = useState('')
    const [creationDateError, setCreationDateError] = useState('')
    const [descriptionError, setDescriptionError] = useState('')
    useEffect(() => {
        if (shouldScrollToError) {
            document.querySelector('.error').scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
    }, [shouldScrollToError])
    const validate = () => {
        setShouldScrollToError()
        setNameError('')
        setTypeError('')
        setCreationDateError('')
        setDescriptionError('')
        let isValidated = true
        if (!name) {
            setNameError('Wprowadź nazwę szkoły!')
            isValidated = false
        }
        if (!type) {
            setTypeError('Zaznacz typ szkoły!')
            isValidated = false
        }
        switch (true) {
            case !creationDate:
                setCreationDateError(
                    `Wprowadź datę utworzenia szkoły (np. ${moment().format('DD.MM.YYYY')})!`
                )
                isValidated = false
                break
            case !moment(creationDate, 'DD.MM.YYYY', true).isValid():
                setCreationDateError(
                    `Wprowadź poprawną date utworzenia szkoły (np. ${moment().format(
                        'DD.MM.YYYY'
                    )})!`
                )
                isValidated = false
                break
            default:
                setCreationDateError('')
        }
        if (!description) {
            setDescriptionError('Wprowadź opis szkoły!')
            isValidated = false
        }
        setTimeout(() => {
            setShouldScrollToError(!isValidated)
        }, 0)
        return isValidated
    }
    const handleSubmit = async e => {
        e.preventDefault()
        if (validate()) {
            try {
                const url = '/api/headTeacher/createSchool'
                const response = await apiAxios.post(url, {
                    name,
                    type,
                    creationDate,
                    description
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
                        setTypeError('')
                        setCreationDateError('')
                        setDescriptionError('')
                        validationResults.forEach(({ parameter, error }) => {
                            if (parameter === 'name') {
                                setNameError(error)
                            }
                            if (parameter === 'type') {
                                setTypeError(error)
                            }
                            if (parameter === 'creationDate') {
                                setCreationDateError(error)
                            }
                            if (parameter === 'description') {
                                setDescriptionError(error)
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
            <AHTCForm.Form onSubmit={handleSubmit}>
                <AHTCComposed.Input
                    id="name"
                    label="Nazwa szkoły"
                    value={name}
                    placeholder="Wprowadź nazwę szkoły..."
                    error={nameError}
                    onChange={setName}
                />
                <Composed.Select
                    id="type"
                    label="Rodzaj szkoły"
                    value={type}
                    placeholder="Zaznacz typ szkoły..."
                    options={['Gimnazjum', 'Technikum', 'Liceum']}
                    error={typeError}
                    onChange={setType}
                />
                <AHTCComposed.Input
                    id="creationDate"
                    label="Data utworzenia szkoły"
                    value={creationDate}
                    placeholder={`Wprowadź datę utworzenia szkoły (np. ${moment().format(
                        'DD.MM.YYYY'
                    )})...`}
                    error={creationDateError}
                    onChange={setCreationDate}
                    trim
                />
                <AHTCComposed.Input
                    id="description"
                    label="Opis szkoły"
                    value={description}
                    placeholder="Wprowadź opis szkoły..."
                    error={descriptionError}
                    onChange={setDescription}
                    textarea
                />
                <AHTCForm.Submit>Utwórz szkołę</AHTCForm.Submit>
            </AHTCForm.Form>
        </HeadTeacherSchoolCreatorContainer>
    )
}

export default compose(withMenu)(HeadTeacherSchoolCreator)
