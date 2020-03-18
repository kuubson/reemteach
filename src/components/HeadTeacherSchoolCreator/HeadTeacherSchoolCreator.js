import React, { useEffect, useState } from 'react'
import styled from 'styled-components/macro'
import moment from 'moment'

import { compose } from 'redux'
import { withMenu } from '@hoc'

import APDashboard from '@components/AdminProfile/styled/Dashboard'
import AHTCForm from '@components/AdminHeadTeacherCreator/styled/Form'

import AHTCComposed from '@components/AdminHeadTeacherCreator/composed'
import Composed from './composed'

import {
    apiAxios,
    delayedApiAxios,
    redirectTo,
    delayedRedirectTo,
    setFeedbackData,
    detectSanitization
} from '@utils'

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
    const [creationYear, setCreationYear] = useState('')
    const [nameError, setNameError] = useState('')
    const [typeError, setTypeError] = useState('')
    const [descriptionError, setDescriptionError] = useState('')
    const [addressError, setAddressError] = useState('')
    const [creationYearError, setCreationYearError] = useState('')
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
        setCreationYearError('')
        let isValidated = true
        switch (true) {
            case !name:
                setNameError('Wprowadź nazwę szkoły!')
                isValidated = false
                break
            case detectSanitization(name):
                setNameError('Nazwa szkoły zawiera niedozwolone znaki!')
                isValidated = false
                break
            default:
                setNameError('')
        }
        switch (true) {
            case !type:
                setTypeError('Zaznacz rodzaj szkoły!')
                isValidated = false
                break
            case detectSanitization(type):
                setTypeError('Rodzaj szkoły zawiera niedozwolone znaki!')
                isValidated = false
                break
            default:
                setTypeError('')
        }
        switch (true) {
            case !description:
                setDescriptionError('Wprowadź opis szkoły!')
                isValidated = false
                break
            case detectSanitization(description):
                setDescriptionError('Opis szkoły zawiera niedozwolone znaki!')
                isValidated = false
                break
            default:
                setDescriptionError('')
        }
        switch (true) {
            case !address:
                setAddressError('Wprowadź adres szkoły!')
                isValidated = false
                break
            case detectSanitization(address):
                setAddressError('Adres szkoły zawiera niedozwolone znaki!')
                isValidated = false
                break
            default:
                setAddressError('')
        }
        switch (true) {
            case !creationYear:
                setCreationYearError(
                    `Wprowadź rok utworzenia szkoły (np. ${moment().format('YYYY')})!`
                )
                isValidated = false
                break
            case !moment(creationYear, 'YYYY', true).isValid():
                setCreationYearError(
                    `Wprowadź poprawny rok utworzenia szkoły (np. ${moment().format('YYYY')})!`
                )
                isValidated = false
                break
            default:
                setCreationYearError('')
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
                    creationYear
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
                        setCreationYearError('')
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
                            if (parameter === 'creationYear') {
                                setCreationYearError(error)
                            }
                        })
                    }
                }
            }
        }
    }
    return (
        <HeadTeacherSchoolCreatorContainer withMenu={shouldMenuAppear}>
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
                    id="creationYear"
                    label="Rok utworzenia szkoły"
                    value={creationYear}
                    placeholder={`Wprowadź rok utworzenia szkoły (np. ${moment().format(
                        'YYYY'
                    )})...`}
                    error={creationYearError}
                    onChange={setCreationYear}
                    trim
                />
                <AHTCForm.Submit>Utwórz szkołę</AHTCForm.Submit>
            </AHTCForm.Form>
        </HeadTeacherSchoolCreatorContainer>
    )
}

export default compose(withMenu)(HeadTeacherSchoolCreator)
