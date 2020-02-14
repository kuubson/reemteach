import React, { useEffect, useState } from 'react'
import styled from 'styled-components/macro'

import { compose } from 'redux'
import { withMenu } from '@hoc'

import APDashboard from '@components/AdminProfile/styled/Dashboard'
import APMenu from '@components/AdminProfile/styled/Menu'
import AHTCForm from '@components/AdminHeadTeacherCreator/styled/Form'
import Detail from './styled/Detail'

import APComposed from '@components/AdminProfile/composed'
import AHTCComposed from '@components/AdminHeadTeacherCreator/composed'
import Composed from './composed'

import { apiAxios, delayedApiAxios, redirectTo, setFeedbackData } from '@utils'

const HeadTeacherProfileContainer = styled(APDashboard.Container)`
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
`

const HeadTeacherProfile = ({ closeMenuOnClick, shouldMenuAppear }) => {
    const [isLoading, setIsLoading] = useState(true)
    const [isActivated, setIsActivated] = useState(false)
    const [shouldScrollToError, setShouldScrollToError] = useState(false)
    const [email, setEmail] = useState('')
    const [name, setName] = useState('')
    const [age, setAge] = useState('')
    const [password, setPassword] = useState('')
    const [repeatedPassword, setRepeatedPassword] = useState('')
    const [surname, setSurname] = useState('')
    const [nameError, setNameError] = useState('')
    const [surnameError, setSurnameError] = useState('')
    const [ageError, setAgeError] = useState('')
    const [passwordError, setPasswordError] = useState('')
    const [repeatedPasswordError, setRepeatedPasswordError] = useState('')
    useEffect(() => {
        const getProfile = async () => {
            const url = '/api/headTeacher/getProfile'
            const response = await delayedApiAxios.get(url)
            if (response) {
                setIsLoading(false)
                const { isActivated, email, name, surname, age } = response.data
                setIsActivated(isActivated)
                setEmail(email)
                setName(name)
                setSurname(surname)
                setAge(age)
            }
        }
        getProfile()
    }, [])
    useEffect(() => {
        if (shouldScrollToError) {
            document.querySelector('.error').scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
    }, [shouldScrollToError])
    const validate = updatingProfile => {
        setShouldScrollToError()
        setNameError('')
        setSurnameError('')
        setAgeError('')
        setPasswordError('')
        setRepeatedPasswordError('')
        let isValidated = true
        if (!name) {
            setNameError('Wprowadź imię!')
            isValidated = false
        }
        if (!surname) {
            setSurnameError('Wprowadź nazwisko!')
            isValidated = false
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
            if (password !== repeatedPassword) {
                setRepeatedPasswordError('Hasła różnią się od siebie!')
                isValidated = false
            }
        }
        setTimeout(() => {
            setShouldScrollToError(!isValidated)
        }, 0)
        return isValidated
    }
    const handleSubmit = async e => {
        e.preventDefault()
        if (validate(true)) {
            try {
                const url = '/api/headTeacher/updateProfile'
                const response = await apiAxios.post(url, {
                    name,
                    surname,
                    age,
                    password,
                    repeatedPassword
                })
                if (response) {
                    setFeedbackData('Pomyślnie zaktualizowano profil!', 'Ok')
                    setIsActivated(true)
                }
            } catch (error) {
                if (error.response) {
                    const { status, validationResults } = error.response.data
                    if (status === 422) {
                        setNameError('')
                        setSurnameError('')
                        setAgeError('')
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
            try {
                const url = '/api/headTeacher/updateDetails'
                const response = await delayedApiAxios.post(url, {
                    name,
                    surname,
                    age
                })
                if (response) {
                    setFeedbackData('Pomyślnie zaktualizowano profil!', 'Ok')
                    setIsActivated(true)
                }
            } catch (error) {
                if (error.response) {
                    const { status, validationResults } = error.response.data
                    if (status === 422) {
                        setNameError('')
                        setSurnameError('')
                        setAgeError('')
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
                        })
                    }
                }
            }
        }
    }
    return (
        <HeadTeacherProfileContainer withMenu={shouldMenuAppear} morePadding>
            <APComposed.Menu>
                <APMenu.Option
                    onClick={() => closeMenuOnClick(() => redirectTo('/dyrektor/tworzenie-szkoły'))}
                >
                    Utwórz szkołę
                </APMenu.Option>
            </APComposed.Menu>
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
                            <Detail.DetailsContainer>
                                <Composed.Detail label="Stanowisko" value="Dyrektor" />
                                <Composed.EditableDetail
                                    label="Imię"
                                    value={name}
                                    error={nameError}
                                    onChange={setName}
                                    onBlur={updateDetails}
                                />
                                <Composed.EditableDetail
                                    label="Nazwisko"
                                    value={surname}
                                    error={surnameError}
                                    onChange={setSurname}
                                    onBlur={updateDetails}
                                />
                                <Composed.EditableDetail
                                    label="Wiek"
                                    value={age}
                                    error={ageError}
                                    onChange={setAge}
                                    onBlur={updateDetails}
                                />
                                <Composed.Detail label="E-mail" value={email} />
                            </Detail.DetailsContainer>
                        </>
                    )}
                </>
            )}
        </HeadTeacherProfileContainer>
    )
}

export default compose(withMenu)(HeadTeacherProfile)
