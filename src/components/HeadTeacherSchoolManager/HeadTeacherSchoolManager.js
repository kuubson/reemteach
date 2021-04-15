import React, { useEffect, useState } from 'react'
import styled from 'styled-components/macro'
import moment from 'moment'

import { compose } from 'redux'
import { withMenu } from 'hoc'

import APDashboard from 'components/AdminProfile/styled/Dashboard'
import HTPDetail from 'components/HeadTeacherProfile/styled/Detail'

import HTPComposed from 'components/HeadTeacherProfile/composed'

import {
    delayedApiAxios,
    delayedRedirectTo,
    setFeedbackData,
    usePrevious,
    detectSanitization
} from 'utils'

const HeadTeacherSchoolManagerContainer = styled(APDashboard.Container)`
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
`

const HeadTeacherSchoolManager = ({ shouldMenuAppear }) => {
    const [isLoading, setIsLoading] = useState(true)
    const [shouldDetailsUpdate, setShouldDetailsUpdate] = useState(false)
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
    const previousDetails = usePrevious({
        name,
        type,
        description,
        address,
        creationYear
    })
    useEffect(() => {
        const getSchool = async () => {
            const url = '/api/headTeacher/getSchool'
            const response = await delayedApiAxios.get(url)
            if (response) {
                setIsLoading(false)
                const { name, type, description, address, creationYear, hasSchool } = response.data
                if (!hasSchool) {
                    setFeedbackData('Musisz najpierw utworzyć szkołę w systemie!', 'Ok')
                    delayedRedirectTo('/dyrektor/tworzenie-szkoły')
                } else {
                    setName(name)
                    setType(type)
                    setDescription(description)
                    setAddress(address)
                    setCreationYear(creationYear)
                }
            }
        }
        getSchool()
    }, [])
    useEffect(() => {
        if (shouldDetailsUpdate) {
            updateDetails()
        }
    }, [shouldDetailsUpdate])
    const validate = () => {
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
        return isValidated
    }
    const updateDetails = async () => {
        if (validate(false)) {
            if (
                JSON.stringify({ name, type, description, address, creationYear }) !==
                JSON.stringify(previousDetails)
            ) {
                try {
                    const url = '/api/headTeacher/updateSchoolDetails'
                    const response = await delayedApiAxios.post(url, {
                        name,
                        type,
                        description,
                        address,
                        creationYear
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
    }
    return (
        <HeadTeacherSchoolManagerContainer withMenu={shouldMenuAppear}>
            {!isLoading && (
                <>
                    <APDashboard.Header>Dane twojej szkoły:</APDashboard.Header>
                    <HTPDetail.DetailsContainer>
                        <HTPComposed.EditableDetail
                            label="Nazwa szkoły"
                            value={name}
                            error={nameError}
                            onChange={setName}
                            onBlur={updateDetails}
                        />
                        <HTPComposed.EditableDetail
                            id="type"
                            label="Rodzaj szkoły"
                            value={type}
                            placeholder="Zaznacz rodzaj szkoły..."
                            options={['Gimnazjum', 'Technikum', 'Liceum']}
                            error={typeError}
                            onChange={type => {
                                setType(type)
                                setShouldDetailsUpdate(true)
                                setTimeout(() => {
                                    setShouldDetailsUpdate(false)
                                }, 0)
                            }}
                            select
                        />
                        <HTPComposed.EditableDetail
                            label="Opis szkoły"
                            value={description}
                            error={descriptionError}
                            onChange={setDescription}
                            onBlur={updateDetails}
                            textarea
                            fullContent
                        />
                        <HTPComposed.EditableDetail
                            label="Adres szkoły"
                            value={address}
                            placeholder="Wprowadź adres szkoły..."
                            error={addressError}
                            onChange={setAddress}
                            onBlur={updateDetails}
                        />
                        <HTPComposed.EditableDetail
                            label="Data utworzenia"
                            value={creationYear}
                            error={creationYearError}
                            onChange={setCreationYear}
                            onBlur={updateDetails}
                            trim
                        />
                    </HTPDetail.DetailsContainer>
                </>
            )}
        </HeadTeacherSchoolManagerContainer>
    )
}

export default compose(withMenu)(HeadTeacherSchoolManager)
