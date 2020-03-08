import React, { useEffect, useState } from 'react'
import styled from 'styled-components/macro'

import { compose } from 'redux'
import { withMenu } from '@hoc'

import APDashboard from '@components/AdminProfile/styled/Dashboard'
import Dashboard from './styled/Dashboard'

import HTPComposed from '@components/HeadTeacherProfile/composed'

import {
    apiAxios,
    delayedApiAxios,
    setFeedbackData,
    setConfirmationPopupData,
    detectWhiteSpaces,
    detectSanitization
} from '@utils'

const AdminHeadTeachersListContainer = styled(APDashboard.Container)`
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
`

const AdminHeadTeachersList = ({ shouldMenuAppear }) => {
    const [isLoading, setIsLoading] = useState(true)
    const [headTeachers, setHeadTeachers] = useState([])
    useEffect(() => {
        const getHeadTeachers = async () => {
            const url = '/api/admin/getHeadTeachers'
            const response = await delayedApiAxios.get(url)
            if (response) {
                setIsLoading(false)
                const { headTeachers } = response.data
                setHeadTeachers(headTeachers)
            }
        }
        getHeadTeachers()
    }, [])
    const destroyHeadTeacher = (id, email) => {
        setConfirmationPopupData(
            `Czy napewno chcesz usunąć dyrektora ${email} z systemu?`,
            'Tak',
            'Nie',
            async () => {
                const url = '/api/admin/destroyHeadTeacher'
                const response = await apiAxios.post(url, {
                    id,
                    email
                })
                if (response) {
                    const { successMessage } = response.data
                    setFeedbackData(successMessage, 'Ok')
                    setHeadTeachers(headTeachers.filter(headTeacher => headTeacher.id !== id))
                }
            }
        )
    }
    const updateHeadTeachers = (id, key, value, errorKey, errorValue, shouldSaveButtonAppear) =>
        setHeadTeachers(
            headTeachers.map(headTeacher =>
                headTeacher.id === id
                    ? {
                          ...headTeacher,
                          [key]: value,
                          [errorKey]: errorValue,
                          shouldSaveButtonAppear
                      }
                    : headTeacher
            )
        )
    const validateHeadTeacher = (name, surname, age) =>
        name &&
        !detectWhiteSpaces(name) &&
        !detectSanitization(name) &&
        surname &&
        !detectWhiteSpaces(surname) &&
        !detectSanitization(surname) &&
        age &&
        !isNaN(age) &&
        age > 23 &&
        age < 101
    const updateHeadTeacher = async (id, email, name, surname, age) => {
        const url = '/api/admin/updateHeadTeacher'
        const response = await apiAxios.post(url, {
            id,
            email,
            name,
            surname,
            age
        })
        if (response) {
            const { successMessage } = response.data
            setFeedbackData(successMessage, 'Ok')
            updateHeadTeachers(id)
        }
    }
    return (
        <AdminHeadTeachersListContainer withMenu={shouldMenuAppear} withMorePadding>
            {!isLoading && (
                <Dashboard.DetailsContainer>
                    {headTeachers.length > 0 ? (
                        headTeachers.map(
                            ({
                                id,
                                email,
                                name,
                                surname,
                                age,
                                nameError,
                                surnameError,
                                ageError,
                                isActivated,
                                createdAt,
                                shouldSaveButtonAppear
                            }) => {
                                return (
                                    <div key={id}>
                                        <HTPComposed.Detail label="Id" value={id} />
                                        {isActivated && (
                                            <>
                                                <HTPComposed.EditableDetail
                                                    label="Imię"
                                                    value={name}
                                                    error={nameError}
                                                    onChange={name =>
                                                        updateHeadTeachers(
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
                                                            validateHeadTeacher(name, surname, age)
                                                        )
                                                    }
                                                    trim
                                                />
                                                <HTPComposed.EditableDetail
                                                    label="Nazwisko"
                                                    value={surname}
                                                    error={surnameError}
                                                    onChange={surname =>
                                                        updateHeadTeachers(
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
                                                            validateHeadTeacher(name, surname, age)
                                                        )
                                                    }
                                                    trim
                                                />
                                                <HTPComposed.EditableDetail
                                                    label="Wiek"
                                                    value={age}
                                                    error={ageError}
                                                    onChange={age =>
                                                        updateHeadTeachers(
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
                                                            validateHeadTeacher(name, surname, age)
                                                        )
                                                    }
                                                    trim
                                                />
                                            </>
                                        )}
                                        <HTPComposed.Detail label="E-mail" value={email} />
                                        <HTPComposed.Detail
                                            label="Data utworzenia"
                                            value={new Date(createdAt).toLocaleString()}
                                        />
                                        {(!isActivated || shouldSaveButtonAppear) && (
                                            <Dashboard.ButtonsContainer>
                                                {!isActivated && (
                                                    <Dashboard.Button
                                                        onClick={() =>
                                                            destroyHeadTeacher(id, email)
                                                        }
                                                    >
                                                        Usuń
                                                    </Dashboard.Button>
                                                )}
                                                {shouldSaveButtonAppear && (
                                                    <Dashboard.Button
                                                        onClick={() =>
                                                            updateHeadTeacher(
                                                                id,
                                                                email,
                                                                name,
                                                                surname,
                                                                age
                                                            )
                                                        }
                                                    >
                                                        Zapisz
                                                    </Dashboard.Button>
                                                )}
                                            </Dashboard.ButtonsContainer>
                                        )}
                                    </div>
                                )
                            }
                        )
                    ) : (
                        <Dashboard.Warning>
                            W systemie nie ma jeszcze żadnego dyrektora!
                        </Dashboard.Warning>
                    )}
                </Dashboard.DetailsContainer>
            )}
        </AdminHeadTeachersListContainer>
    )
}

export default compose(withMenu)(AdminHeadTeachersList)
