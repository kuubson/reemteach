import React, { useEffect, useState } from 'react'
import styled from 'styled-components/macro'
import moment from 'moment'

import { compose } from 'redux'
import { withMenu } from '@hoc'

import APDashboard from '@components/AdminProfile/styled/Dashboard'
import AHTCForm from '@components/AdminHeadTeacherCreator/styled/Form'

import AHTCComposed from '@components/AdminHeadTeacherCreator/composed'
import Composed from './composed'

import { apiAxios, delayedApiAxios, redirectTo, delayedRedirectTo, setFeedbackData } from '@utils'

const HeadTeacherSchoolCreatorContainer = styled(APDashboard.Container)`
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
`

const HeadTeacherSchoolCreator = ({ shouldMenuAppear }) => {
    const [shouldScrollToError, setShouldScrollToError] = useState(false)
    const [name, setName] = useState('')
    const [type, setType] = useState('')
    const [description, setDescription] = useState('')
    const [address, setAddress] = useState('')
    const [creationDate, setCreationDate] = useState('')
    const [nameError, setNameError] = useState('')
    const [typeError, setTypeError] = useState('')
    const [descriptionError, setDescriptionError] = useState('')
    const [addressError, setAddressError] = useState('')
    const [creationDateError, setCreationDateError] = useState('')
    useEffect(() => {
        const getSchool = async () => {
            const url = '/api/headTeacher/getSchool'
            const response = await delayedApiAxios.get(url)
            if (response) {
                const { hasSchool } = response.data
                if (hasSchool) {
                    setFeedbackData('Utworzyłeś już szkołę w systemie!', 'Ok')
                    delayedRedirectTo('/dyrektor/zarządzanie-szkołą')
                }
            }
        }
        getSchool()
    }, [])
    useEffect(() => {
        if (shouldScrollToError) {
            document.querySelector('.error').scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
    }, [shouldScrollToError])
    const validate = () => {
        setShouldScrollToError()
        setNameError('')
        setTypeError('')
        setDescriptionError('')
        setAddressError('')
        setCreationDateError('')
        let isValidated = true
        if (!name) {
            setNameError('Wprowadź nazwę szkoły!')
            isValidated = false
        }
        if (!type) {
            setTypeError('Zaznacz rodzaj szkoły!')
            isValidated = false
        }
        if (!description) {
            setDescriptionError('Wprowadź opis szkoły!')
            isValidated = false
        }
        if (!address) {
            setAddressError('Wprowadź adres szkoły!')
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
                    description,
                    address,
                    creationDate
                })
                if (response) {
                    const { successMessage } = response.data
                    setFeedbackData(successMessage, 'Ok')
                    redirectTo('/dyrektor/zarządzanie-szkołą')
                }
            } catch (error) {
                if (error.response) {
                    const { status, validationResults } = error.response.data
                    if (status === 422) {
                        setNameError('')
                        setTypeError('')
                        setDescriptionError('')
                        setAddressError('')
                        setCreationDateError('')
                        validationResults.forEach(({ parameter, error }) => {
                            if (parameter === 'name') {
                                setNameError(error)
                            }
                            if (parameter === 'type') {
                                setTypeError(error)
                            }
                            if (parameter === 'description') {
                                setDescriptionError(error)
                            }
                            if (parameter === 'address') {
                                setAddressError(error)
                            }
                            if (parameter === 'creationDate') {
                                setCreationDateError(error)
                            }
                        })
                    }
                }
            }
        }
    }
    return (
        <HeadTeacherSchoolCreatorContainer withMenu={shouldMenuAppear} withMorePadding>
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
                    placeholder="Zaznacz rodzaj szkoły..."
                    options={['Gimnazjum', 'Technikum', 'Liceum']}
                    error={typeError}
                    onChange={setType}
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
                <AHTCComposed.Input
                    id="address"
                    label="Adres szkoły"
                    value={address}
                    placeholder="Wprowadź adres szkoły..."
                    error={addressError}
                    onChange={setAddress}
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
                <AHTCForm.Submit>Utwórz szkołę</AHTCForm.Submit>
            </AHTCForm.Form>
        </HeadTeacherSchoolCreatorContainer>
    )
}

export default compose(withMenu)(HeadTeacherSchoolCreator)
