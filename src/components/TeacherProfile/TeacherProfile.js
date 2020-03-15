import React, { useEffect, useState } from 'react'
import styled from 'styled-components/macro'

import { compose } from 'redux'
import { withMenu } from '@hoc'

import APDashboard from '@components/AdminProfile/styled/Dashboard'
import AHTCForm from '@components/AdminHeadTeacherCreator/styled/Form'
import HTPDetail from '@components/HeadTeacherProfile/styled/Detail'

import AHTCComposed from '@components/AdminHeadTeacherCreator/composed'
import HTPComposed from '@components/HeadTeacherProfile/composed'
import HTSCComposed from '@components/HeadTeacherSchoolCreator/composed'

import {
    apiAxios,
    delayedApiAxios,
    setFeedbackData,
    usePrevious,
    detectWhiteSpaces,
    detectSanitization
} from '@utils'

const TeacherProfileContainer = styled(APDashboard.Container)`
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
`

const TeacherProfile = ({ shouldMenuAppear }) => {
    const [isLoading, setIsLoading] = useState(true)
    const [shouldScrollToError, setShouldScrollToError] = useState(false)
    const [shouldDetailsUpdate, setShouldDetailsUpdate] = useState(false)
    const [email, setEmail] = useState('')
    const [name, setName] = useState('')
    const [surname, setSurname] = useState('')
    const [age, setAge] = useState('')
    const [description, setDescription] = useState('')
    const [subject, setSubject] = useState('')
    const [password, setPassword] = useState('')
    const [repeatedPassword, setRepeatedPassword] = useState('')
    const [nameError, setNameError] = useState('')
    const [surnameError, setSurnameError] = useState('')
    const [ageError, setAgeError] = useState('')
    const [descriptionError, setDescriptionError] = useState('')
    const [subjectError, setSubjectError] = useState('')
    const [passwordError, setPasswordError] = useState('')
    const [repeatedPasswordError, setRepeatedPasswordError] = useState('')
    const [isActivated, setIsActivated] = useState(false)
    const previousDetails = usePrevious({
        name,
        surname,
        age,
        description,
        subject
    })
    useEffect(() => {
        const getProfile = async () => {
            const url = '/api/teacher/getProfile'
            const response = await delayedApiAxios.get(url)
            if (response) {
                setIsLoading(false)
                const {
                    email,
                    name,
                    surname,
                    age,
                    description,
                    subject,
                    isActivated
                } = response.data
                setEmail(email)
                if (isActivated) {
                    setName(name)
                    setSurname(surname)
                    setAge(age)
                    setDescription(description)
                    setSubject(subject)
                }
                setIsActivated(isActivated)
            }
        }
        getProfile()
    }, [])
    useEffect(() => {
        if (shouldScrollToError) {
            document.querySelector('.error').scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
    }, [shouldScrollToError])
    useEffect(() => {
        if (shouldDetailsUpdate) {
            updateDetails()
        }
    }, [shouldDetailsUpdate])
    const validate = updatingProfile => {
        setShouldScrollToError()
        setNameError('')
        setSurnameError('')
        setAgeError('')
        setDescriptionError('')
        setSubjectError('')
        setPasswordError('')
        setRepeatedPasswordError('')
        let isValidated = true
        switch (true) {
            case !name:
                setNameError('Wprowadź imię!')
                isValidated = false
                break
            case detectWhiteSpaces(name):
                setNameError('Wprowadź poprawne imię!')
                isValidated = false
                break
            case detectSanitization(name):
                setNameError('Imię zawiera niedozwolone znaki!')
                isValidated = false
                break
            default:
                setNameError('')
        }
        switch (true) {
            case !surname:
                setSurnameError('Wprowadź nazwisko!')
                isValidated = false
                break
            case detectWhiteSpaces(surname):
                setSurnameError('Wprowadź poprawne nazwisko!')
                isValidated = false
                break
            case detectSanitization(surname):
                setSurnameError('Nazwisko zawiera niedozwolone znaki!')
                isValidated = false
                break
            default:
                setSurnameError('')
        }
        switch (true) {
            case !age:
                setAgeError('Wprowadź wiek!')
                isValidated = false
                break
            case isNaN(age):
                setAgeError('Wprowadź poprawy wiek!')
                isValidated = false
                break
            case age < 24 || age > 100:
                setAgeError('Wiek musi mieścić się między 24 a 100!')
                isValidated = false
                break
            default:
                setAgeError('')
        }
        switch (true) {
            case !description:
                setDescriptionError('Wprowadź opis siebie!')
                isValidated = false
                break
            case detectSanitization(description):
                setDescriptionError('Opis siebie zawiera niedozwolone znaki!')
                isValidated = false
                break
            default:
                setDescriptionError('')
        }
        switch (true) {
            case !subject:
                setSubjectError('Zaznacz przedmiot przewodni!')
                isValidated = false
                break
            case detectSanitization(subject):
                setSubjectError('Przedmiot przewodni zawiera niedozwolone znaki!')
                isValidated = false
                break
            default:
                setSubjectError('')
        }
        if (updatingProfile) {
            const hasLowerCaseLetters = /^(?=.*[a-z])/
            const hasUpperCaseLetters = /^(?=.*[A-Z])/
            const hasNumbers = /^(?=.*[0-9])/
            switch (true) {
                case !password:
                    setPasswordError('Wprowadź hasło!')
                    isValidated = false
                    break
                case password.length < 10:
                    setPasswordError('Hasło musi zawierać co najmniej 10 znaków!')
                    isValidated = false
                    break
                case !password.match(hasLowerCaseLetters):
                    setPasswordError('Hasło musi zawierać małe litery!')
                    isValidated = false
                    break
                case !password.match(hasUpperCaseLetters):
                    setPasswordError('Hasło musi zawierać duże litery!')
                    isValidated = false
                    break
                case !password.match(hasNumbers):
                    setPasswordError('Hasło musi zawierać cyfry!')
                    isValidated = false
                    break
                default:
                    setPasswordError('')
            }
            switch (true) {
                case !repeatedPassword:
                    setRepeatedPasswordError('Potwórz hasło!')
                    isValidated = false
                    break
                case password !== repeatedPassword:
                    setRepeatedPasswordError('Hasła różnią się od siebie!')
                    isValidated = false
                    break
                default:
                    setRepeatedPasswordError('')
            }
        }
        if (updatingProfile) {
            setTimeout(() => {
                setShouldScrollToError(!isValidated)
            }, 0)
        }
        return isValidated
    }
    const handleSubmit = async e => {
        e.preventDefault()
        if (validate(true)) {
            try {
                const url = '/api/teacher/updateProfile'
                const response = await apiAxios.post(url, {
                    name,
                    surname,
                    age,
                    description,
                    subject,
                    password,
                    repeatedPassword
                })
                if (response) {
                    const { successMessage } = response.data
                    setFeedbackData(successMessage, 'Ok')
                    setIsActivated(true)
                }
            } catch (error) {
                if (error.response) {
                    const { status, validationResults } = error.response.data
                    if (status === 422) {
                        setNameError('')
                        setSurnameError('')
                        setAgeError('')
                        setDescriptionError('')
                        setSubjectError('')
                        setPasswordError('')
                        setRepeatedPasswordError('')
                        validationResults.forEach(({ parameter, error }) => {
                            if (parameter === 'name') {
                                setNameError(error)
                            }
                            if (parameter === 'surname') {
                                setSurnameError(error)
                            }
                            if (parameter === 'age') {
                                setAgeError(error)
                            }
                            if (parameter === 'description') {
                                setDescriptionError(error)
                            }
                            if (parameter === 'subject') {
                                setSubjectError(error)
                            }
                            if (parameter === 'password') {
                                setPasswordError(error)
                            }
                            if (parameter === 'repeatedPassword') {
                                setRepeatedPasswordError(error)
                            }
                        })
                    }
                }
            }
        }
    }
    const updateDetails = async () => {
        if (validate(false)) {
            if (
                JSON.stringify({ name, surname, age, description, subject }) !==
                JSON.stringify(previousDetails)
            ) {
                try {
                    const url = '/api/teacher/updateDetails'
                    const response = await delayedApiAxios.post(url, {
                        name,
                        surname,
                        age,
                        description,
                        subject
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
                            setSurnameError('')
                            setAgeError('')
                            setDescriptionError('')
                            setSubjectError('')
                            validationResults.forEach(({ parameter, error }) => {
                                if (parameter === 'name') {
                                    setNameError(error)
                                }
                                if (parameter === 'surname') {
                                    setSurnameError(error)
                                }
                                if (parameter === 'age') {
                                    setAgeError(error)
                                }
                                if (parameter === 'description') {
                                    setDescriptionError(error)
                                }
                                if (parameter === 'subject') {
                                    setSubjectError(error)
                                }
                            })
                        }
                    }
                }
            }
        }
    }
    return (
        <TeacherProfileContainer withMenu={shouldMenuAppear} withMorePadding>
            {!isLoading && (
                <>
                    {!isActivated && (
                        <>
                            <APDashboard.Header>Zaktualizuj swoje dane</APDashboard.Header>
                            <AHTCForm.Form onSubmit={handleSubmit}>
                                <AHTCComposed.Input
                                    id="name"
                                    label="Imię"
                                    value={name}
                                    placeholder="Wprowadź imię..."
                                    error={nameError}
                                    onChange={setName}
                                    trim
                                />
                                <AHTCComposed.Input
                                    id="surname"
                                    label="Nazwisko"
                                    value={surname}
                                    placeholder="Wprowadź nazwisko..."
                                    error={surnameError}
                                    onChange={setSurname}
                                    trim
                                />
                                <AHTCComposed.Input
                                    id="age"
                                    label="Wiek"
                                    value={age}
                                    placeholder="Wprowadź wiek..."
                                    error={ageError}
                                    onChange={setAge}
                                    trim
                                />
                                <AHTCComposed.Input
                                    id="description"
                                    label="Opis siebie"
                                    value={description}
                                    placeholder="Wprowadź opis siebie..."
                                    error={descriptionError}
                                    onChange={setDescription}
                                    textarea
                                />
                                <HTSCComposed.Select
                                    id="subject"
                                    label="Przedmiot przewodni"
                                    value={subject}
                                    placeholder="Zaznacz przedmiot przewodni..."
                                    options={[
                                        'Religia',
                                        'Język polski',
                                        'Język angielski',
                                        'Język niemiecki',
                                        'Język rosyjski',
                                        'Język francuski',
                                        'Matematyka',
                                        'Fizyka',
                                        'Biologia',
                                        'Chemia',
                                        'Geografia',
                                        'Wiedza o społeczeństwie',
                                        'Historia',
                                        'Informatyka'
                                    ]}
                                    error={subjectError}
                                    onChange={setSubject}
                                />
                                <AHTCComposed.Input
                                    id="password"
                                    label="Hasło"
                                    value={password}
                                    placeholder="Wprowadź nowe hasło..."
                                    error={passwordError}
                                    onChange={setPassword}
                                    secure
                                    trim
                                />
                                <AHTCComposed.Input
                                    id="repeatedPassword"
                                    label="Potwórzone hasło"
                                    value={repeatedPassword}
                                    placeholder="Potwórz hasło..."
                                    error={repeatedPasswordError}
                                    onChange={setRepeatedPassword}
                                    secure
                                    trim
                                />
                                <AHTCForm.Submit>Zaktualizuj dane</AHTCForm.Submit>
                            </AHTCForm.Form>
                        </>
                    )}
                    {isActivated && (
                        <>
                            <APDashboard.Header>Dane twojego profilu:</APDashboard.Header>
                            <HTPDetail.DetailsContainer>
                                <HTPComposed.Detail label="Stanowisko" value="Nauczyciel" />
                                <HTPComposed.EditableDetail
                                    label="Imię"
                                    value={name}
                                    error={nameError}
                                    onChange={setName}
                                    onBlur={updateDetails}
                                    trim
                                />
                                <HTPComposed.EditableDetail
                                    label="Nazwisko"
                                    value={surname}
                                    error={surnameError}
                                    onChange={setSurname}
                                    onBlur={updateDetails}
                                    trim
                                />
                                <HTPComposed.EditableDetail
                                    label="Wiek"
                                    value={age}
                                    error={ageError}
                                    onChange={setAge}
                                    onBlur={updateDetails}
                                    trim
                                />
                                <HTPComposed.EditableDetail
                                    label="Opis siebie"
                                    value={description}
                                    error={descriptionError}
                                    onChange={setDescription}
                                    onBlur={updateDetails}
                                    textarea
                                />
                                <HTPComposed.EditableDetail
                                    id="subject"
                                    label="Przedmiot przewodni"
                                    value={subject}
                                    placeholder="Zaznacz przedmiot przewodni..."
                                    options={[
                                        'Religia',
                                        'Język polski',
                                        'Język angielski',
                                        'Język niemiecki',
                                        'Język rosyjski',
                                        'Język francuski',
                                        'Matematyka',
                                        'Fizyka',
                                        'Biologia',
                                        'Chemia',
                                        'Geografia',
                                        'Wiedza o społeczeństwie',
                                        'Historia',
                                        'Informatyka'
                                    ]}
                                    error={subjectError}
                                    onChange={subject => {
                                        setSubject(subject)
                                        setShouldDetailsUpdate(true)
                                        setTimeout(() => {
                                            setShouldDetailsUpdate(false)
                                        }, 0)
                                    }}
                                    select
                                />
                                <HTPComposed.Detail label="E-mail" value={email} />
                            </HTPDetail.DetailsContainer>
                        </>
                    )}
                </>
            )}
        </TeacherProfileContainer>
    )
}

export default compose(withMenu)(TeacherProfile)
