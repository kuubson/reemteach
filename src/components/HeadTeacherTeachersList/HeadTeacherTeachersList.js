import React, { useEffect, useState } from 'react'
import styled from 'styled-components/macro'

import { compose } from 'redux'
import { withMenu } from '@hoc'

import APDashboard from '@components/AdminProfile/styled/Dashboard'
import AHTLDashboard from '@components/AdminHeadTeachersList/styled/Dashboard'

import HTPComposed from '@components/HeadTeacherProfile/composed'

import {
    apiAxios,
    delayedApiAxios,
    setFeedbackData,
    setConfirmationPopupData,
    detectWhiteSpaces,
    detectSanitization
} from '@utils'

const HeadTeacherTeachersListContainer = styled(APDashboard.Container)`
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
`

const HeadTeacherTeachersList = ({ shouldMenuAppear }) => {
    const [isLoading, setIsLoading] = useState(true)
    const [teachers, setTeachers] = useState([])
    useEffect(() => {
        const getTeachers = async () => {
            const url = '/api/headTeacher/getTeachers'
            const response = await delayedApiAxios.get(url)
            if (response) {
                setIsLoading(false)
                const { teachers } = response.data
                setTeachers(teachers)
            }
        }
        getTeachers()
    }, [])
    const removeTeacher = (id, email) => {
        setConfirmationPopupData(
            `Czy napewno chcesz usunąć nauczyciela ${email} ze szkoły?`,
            'Tak',
            'Nie',
            async () => {
                const url = '/api/headTeacher/removeTeacher'
                const response = await apiAxios.post(url, {
                    id,
                    email
                })
                if (response) {
                    const { successMessage } = response.data
                    setFeedbackData(successMessage, 'Ok')
                    setTeachers(teachers.filter(teacher => teacher.id !== id))
                }
            }
        )
    }
    const updateTeachers = (id, key, value, errorKey, errorValue, shouldSaveButtonAppear) =>
        setTeachers(
            teachers.map(teacher =>
                teacher.id === id
                    ? {
                          ...teacher,
                          [key]: value,
                          [errorKey]: errorValue,
                          shouldSaveButtonAppear
                      }
                    : teacher
            )
        )
    const validateTeacher = (name, surname, age, description, subject) =>
        name &&
        !detectWhiteSpaces(name) &&
        !detectSanitization(name) &&
        surname &&
        !detectWhiteSpaces(surname) &&
        !detectSanitization(surname) &&
        age &&
        !isNaN(age) &&
        age > 23 &&
        age < 101 &&
        description &&
        !detectSanitization(description) &&
        subject &&
        !detectSanitization(subject)
    const updateTeacher = async (id, email, name, surname, age, description, subject) => {
        const url = '/api/headTeacher/updateTeacher'
        const response = await apiAxios.post(url, {
            id,
            email,
            name,
            surname,
            age,
            description,
            subject
        })
        if (response) {
            const { successMessage } = response.data
            setFeedbackData(successMessage, 'Ok')
            updateTeachers(id, 'shouldSaveButtonAppear', false)
        }
    }
    return (
        <HeadTeacherTeachersListContainer withMenu={shouldMenuAppear} withMorePadding>
            {!isLoading && (
                <AHTLDashboard.HeadTeachersContainer>
                    {teachers.length > 0 ? (
                        teachers.map(
                            ({
                                id,
                                email,
                                name,
                                surname,
                                age,
                                description,
                                subject,
                                nameError,
                                surnameError,
                                ageError,
                                descriptionError,
                                subjectError,
                                isActivated,
                                createdAt,
                                shouldSaveButtonAppear
                            }) => {
                                return (
                                    <AHTLDashboard.DetailsContainer key={id}>
                                        <HTPComposed.Detail label="Id" value={id} />
                                        {isActivated && (
                                            <>
                                                <HTPComposed.EditableDetail
                                                    label="Imię"
                                                    value={name}
                                                    error={nameError}
                                                    onChange={name =>
                                                        updateTeachers(
                                                            id,
                                                            'name',
                                                            name,
                                                            'nameError',
                                                            !name
                                                                ? 'Wprowadź imię!'
                                                                : detectWhiteSpaces(name)
                                                                ? 'Wprowadź poprawne imię!'
                                                                : detectSanitization(name)
                                                                ? 'Imię zawiera niedozwolone znaki!'
                                                                : '',
                                                            validateTeacher(
                                                                name,
                                                                surname,
                                                                age,
                                                                description,
                                                                subject
                                                            )
                                                        )
                                                    }
                                                    trim
                                                />
                                                <HTPComposed.EditableDetail
                                                    label="Nazwisko"
                                                    value={surname}
                                                    error={surnameError}
                                                    onChange={surname =>
                                                        updateTeachers(
                                                            id,
                                                            'surname',
                                                            surname,
                                                            'surnameError',
                                                            !surname
                                                                ? 'Wprowadź nazwisko!'
                                                                : detectWhiteSpaces(surname)
                                                                ? 'Wprowadź poprawne nazwisko!'
                                                                : detectSanitization(surname)
                                                                ? 'Nazwisko zawiera niedozwolone znaki!'
                                                                : '',
                                                            validateTeacher(
                                                                name,
                                                                surname,
                                                                age,
                                                                description,
                                                                subject
                                                            )
                                                        )
                                                    }
                                                    trim
                                                />
                                                <HTPComposed.EditableDetail
                                                    label="Wiek"
                                                    value={age}
                                                    error={ageError}
                                                    onChange={age =>
                                                        updateTeachers(
                                                            id,
                                                            'age',
                                                            age,
                                                            'ageError',
                                                            !age
                                                                ? 'Wprowadź wiek!'
                                                                : isNaN(age)
                                                                ? 'Wprowadź poprawy wiek!'
                                                                : age < 24 || age > 100
                                                                ? 'Wiek musi mieścić się między 24 a 100!'
                                                                : '',
                                                            validateTeacher(
                                                                name,
                                                                surname,
                                                                age,
                                                                description,
                                                                subject
                                                            )
                                                        )
                                                    }
                                                    trim
                                                />
                                                <HTPComposed.EditableDetail
                                                    label="Opis"
                                                    value={description}
                                                    error={descriptionError}
                                                    onChange={description =>
                                                        updateTeachers(
                                                            id,
                                                            'description',
                                                            description,
                                                            'descriptionError',
                                                            !description
                                                                ? 'Wprowadź opis!'
                                                                : detectSanitization(description)
                                                                ? 'Opis zawiera niedozwolone znaki!'
                                                                : '',
                                                            validateTeacher(
                                                                name,
                                                                surname,
                                                                age,
                                                                description,
                                                                subject
                                                            )
                                                        )
                                                    }
                                                />
                                                <HTPComposed.EditableDetail
                                                    label="Przedmiot przewodni"
                                                    value={subject}
                                                    error={subjectError}
                                                    onChange={subject =>
                                                        updateTeachers(
                                                            id,
                                                            'subject',
                                                            subject,
                                                            'subjectError',
                                                            !subject
                                                                ? 'Wprowadź przedmiot przewodni!'
                                                                : detectSanitization(subject)
                                                                ? 'Przedmiot przewodni zawiera niedozwolone znaki!'
                                                                : '',
                                                            validateTeacher(
                                                                name,
                                                                surname,
                                                                age,
                                                                description,
                                                                subject
                                                            )
                                                        )
                                                    }
                                                />
                                            </>
                                        )}
                                        <HTPComposed.Detail label="E-mail" value={email} />
                                        <HTPComposed.Detail
                                            label="Data utworzenia"
                                            value={new Date(createdAt).toLocaleString()}
                                        />
                                        {(!isActivated || shouldSaveButtonAppear) && (
                                            <AHTLDashboard.ButtonsContainer>
                                                {!isActivated && (
                                                    <AHTLDashboard.Button
                                                        onClick={() => removeTeacher(id, email)}
                                                    >
                                                        Usuń
                                                    </AHTLDashboard.Button>
                                                )}
                                                {shouldSaveButtonAppear && (
                                                    <AHTLDashboard.Button
                                                        onClick={() =>
                                                            updateTeacher(
                                                                id,
                                                                email,
                                                                name,
                                                                surname,
                                                                age,
                                                                description,
                                                                subject
                                                            )
                                                        }
                                                    >
                                                        Zapisz
                                                    </AHTLDashboard.Button>
                                                )}
                                            </AHTLDashboard.ButtonsContainer>
                                        )}
                                    </AHTLDashboard.DetailsContainer>
                                )
                            }
                        )
                    ) : (
                        <AHTLDashboard.Warning>
                            W szkole nie ma jeszcze żadnego nauczyciela!
                        </AHTLDashboard.Warning>
                    )}
                </AHTLDashboard.HeadTeachersContainer>
            )}
        </HeadTeacherTeachersListContainer>
    )
}

export default compose(withMenu)(HeadTeacherTeachersList)
