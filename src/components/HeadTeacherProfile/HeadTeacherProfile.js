import React, { useEffect, useState } from 'react'
import styled from 'styled-components/macro'

import { compose } from 'redux'
import { withMenu } from 'hoc'

import APDashboard from 'components/AdminProfile/styled/Dashboard'
import AHTCForm from 'components/AdminHeadTeacherCreator/styled/Form'
import Detail from './styled/Detail'

import AHTCComposed from 'components/AdminHeadTeacherCreator/composed'
import Composed from './composed'

import {
    apiAxios,
    delayedApiAxios,
    setFeedbackData,
    usePrevious,
    detectWhiteSpaces,
    detectSanitization
} from 'utils'

const HeadTeacherProfileContainer = styled(APDashboard.Container)`
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
`

const HeadTeacherProfile = ({ shouldMenuAppear }) => {
    const [isLoading, setIsLoading] = useState(true)
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
    const [isActivated, setIsActivated] = useState(false)
    const previousDetails = usePrevious({
        name,
        surname,
        age
    })
    useEffect(() => {
        const getProfile = async () => {
            const url = '/api/headTeacher/getProfile'
            const response = await delayedApiAxios.get(url)
            if (response) {
                setIsLoading(false)
                const { email, name, surname, age, isActivated } = response.data
                setEmail(email)
                if (isActivated) {
                    setName(name)
                    setSurname(surname)
                    setAge(age)
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
    const validate = updatingProfile => {
        setShouldScrollToError()
        setNameError('')
        setSurnameError('')
        setAgeError('')
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
                const url = '/api/headTeacher/updateProfile'
                const response = await apiAxios.post(url, {
                    name,
                    surname,
                    age,
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
            if (JSON.stringify({ name, surname, age }) !== JSON.stringify(previousDetails)) {
                try {
                    const url = '/api/headTeacher/updateDetails'
                    const response = await delayedApiAxios.post(url, {
                        name,
                        surname,
                        age
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
    }
    return (
        <HeadTeacherProfileContainer withMenu={shouldMenuAppear}>
            {!isLoading &&
                (isActivated ? (
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
                                trim
                            />
                            <Composed.EditableDetail
                                label="Nazwisko"
                                value={surname}
                                error={surnameError}
                                onChange={setSurname}
                                onBlur={updateDetails}
                                trim
                            />
                            <Composed.EditableDetail
                                label="Wiek"
                                value={age}
                                error={ageError}
                                onChange={setAge}
                                onBlur={updateDetails}
                                trim
                            />
                            <Composed.Detail label="E-mail" value={email} />
                        </Detail.DetailsContainer>
                    </>
                ) : (
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
                ))}
        </HeadTeacherProfileContainer>
    )
}

export default compose(withMenu)(HeadTeacherProfile)
