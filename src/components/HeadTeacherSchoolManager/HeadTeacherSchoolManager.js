import React, { useEffect, useState } from 'react'
import styled from 'styled-components/macro'
import moment from 'moment'

import { compose } from 'redux'
import { withMenu } from '@hoc'

import APDashboard from '@components/AdminProfile/styled/Dashboard'
import HTPDetail from '@components/HeadTeacherProfile/styled/Detail'

import HTPComposed from '@components/HeadTeacherProfile/composed'

import {
    delayedApiAxios,
    delayedRedirectTo,
    setFeedbackData,
    usePrevious,
    detectSanitization
} from '@utils'

const HeadTeacherSchoolManagerContainer = styled(APDashboard.Container)`
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
`

const HeadTeacherSchoolManager = ({ shouldMenuAppear }) => {
    const [isLoading, setIsLoading] = useState(true)
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
    const previousDetails = usePrevious({
        name,
        type,
        description,
        address,
        creationDate
    })
    useEffect(() => {
        const getSchool = async () => {
            const url = '/api/headTeacher/getSchool'
            const response = await delayedApiAxios.get(url)
            if (response) {
                setIsLoading(false)
                const { name, type, description, address, creationDate, hasSchool } = response.data
                if (!hasSchool) {
                    setFeedbackData('Musisz najpierw utworzyć szkołę w systemie!', 'Ok')
                    delayedRedirectTo('/dyrektor/tworzenie-szkoły')
                } else {
                    setName(name)
                    setType(type)
                    setDescription(description)
                    setAddress(address)
                    setCreationDate(creationDate)
                }
            }
        }
        getSchool()
    }, [])
    const validate = () => {
        setNameError('')
        setTypeError('')
        setDescriptionError('')
        setAddressError('')
        setCreationDateError('')
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
                setTypeError('Wprowadź rodzaj szkoły!')
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
        return isValidated
    }
    const updateDetails = async () => {
        if (validate(false)) {
            const {
                name: previousName,
                type: previousType,
                description: previousDescription,
                address: previousAddress,
                creationDate: previousCreationDate
            } = previousDetails
            if (
                previousName &&
                previousType &&
                previousDetails &&
                previousAddress &&
                previousCreationDate &&
                (name !== previousName ||
                    type !== previousType ||
                    description !== previousDescription ||
                    address !== previousAddress ||
                    creationDate !== previousCreationDate)
            ) {
                try {
                    const url = '/api/headTeacher/updateSchoolDetails'
                    const response = await delayedApiAxios.post(url, {
                        name,
                        type,
                        description,
                        address,
                        creationDate
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
    }
    return (
        <HeadTeacherSchoolManagerContainer withMenu={shouldMenuAppear} withMorePadding>
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
                            label="Rodzaj szkoły"
                            value={type}
                            error={typeError}
                            onChange={setType}
                            onBlur={updateDetails}
                        />
                        <HTPComposed.EditableDetail
                            label="Opis szkoły"
                            value={description}
                            error={descriptionError}
                            onChange={setDescription}
                            onBlur={updateDetails}
                            textarea
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
                            value={creationDate}
                            error={creationDateError}
                            onChange={setCreationDate}
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
