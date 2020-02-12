import React, { useEffect, useState } from 'react'
import styled from 'styled-components/macro'

import { compose } from 'redux'
import { withMenu } from '@hoc'

import APDashboard from '@components/AdminProfile/styled/Dashboard'
import APMenu from '@components/AdminProfile/styled/Menu'
import Dashboard from './styled/Dashboard'
import HeadTeacher from './styled/HeadTeacher'

import APComposed from '@components/AdminProfile/composed'
import HTPComposed from '@components/HeadTeacherProfile/composed'

import {
    apiAxios,
    delayedApiAxios,
    setFeedbackData,
    setConfirmationPopupData,
    redirectTo
} from '@utils'

const AdminHeadTeachersListContainer = styled(APDashboard.Container)`
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
`

const AdminHeadTeachersList = ({ closeMenuOnClick, shouldMenuAppear }) => {
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
    const removeHeadTeacher = (id, email) => {
        setConfirmationPopupData(
            `Czy napewno chcesz usunąć dyrektora ${email} z systemu?`,
            'Tak',
            'Nie',
            async () => {
                const url = '/api/admin/removeHeadTeacher'
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
    const updateHeadTeacher = (id, key, value) =>
        setHeadTeachers(
            headTeachers.map(headTeacher =>
                headTeacher.id === id ? { ...headTeacher, [key]: value } : headTeacher
            )
        )
    return (
        <AdminHeadTeachersListContainer withMenu={shouldMenuAppear} morePadding>
            <APComposed.Menu>
                <APMenu.Option onClick={() => closeMenuOnClick(() => redirectTo('/admin/profil'))}>
                    Strona główna
                </APMenu.Option>
                <APMenu.Option
                    onClick={() => closeMenuOnClick(() => redirectTo('/admin/tworzenie-dyrektora'))}
                >
                    Utwórz dyrektora
                </APMenu.Option>
            </APComposed.Menu>
            {!isLoading && (
                <HeadTeacher.HeadTeachersContainer>
                    {headTeachers.length > 0 ? (
                        headTeachers.map(
                            ({
                                isActivated,
                                id,
                                email,
                                name,
                                surname,
                                age,
                                nameError,
                                surnameError,
                                ageError
                            }) => {
                                return (
                                    <HeadTeacher.DetailsContainer key={id}>
                                        <HTPComposed.Detail label="Id" value={id} />
                                        {isActivated && (
                                            <>
                                                <HTPComposed.EditableDetail
                                                    label="Imię"
                                                    value={name}
                                                    error={nameError}
                                                    onChange={name =>
                                                        updateHeadTeacher(id, 'name', name)
                                                    }
                                                    onBlur={() => {
                                                        if (!name) {
                                                            updateHeadTeacher(
                                                                id,
                                                                'nameError',
                                                                'Wprowadź imię!'
                                                            )
                                                        } else {
                                                            updateHeadTeacher(id, 'nameError', '')
                                                        }
                                                    }}
                                                />
                                                <HTPComposed.EditableDetail
                                                    label="Nazwisko"
                                                    value={surname}
                                                    error={surnameError}
                                                    onChange={surname =>
                                                        updateHeadTeacher(id, 'surname', surname)
                                                    }
                                                    onBlur={() => {
                                                        if (!surname) {
                                                            updateHeadTeacher(
                                                                id,
                                                                'surnameError',
                                                                'Wprowadź nazwisko!'
                                                            )
                                                        } else {
                                                            updateHeadTeacher(
                                                                id,
                                                                'surnameError',
                                                                ''
                                                            )
                                                        }
                                                    }}
                                                />
                                                <HTPComposed.EditableDetail
                                                    label="Wiek"
                                                    value={age}
                                                    error={ageError}
                                                    onChange={age =>
                                                        updateHeadTeacher(id, 'age', age)
                                                    }
                                                    onBlur={() => {
                                                        switch (true) {
                                                            case !age:
                                                                updateHeadTeacher(
                                                                    id,
                                                                    'ageError',
                                                                    'Wprowadź wiek!'
                                                                )
                                                                break
                                                            case isNaN(age):
                                                                updateHeadTeacher(
                                                                    id,
                                                                    'ageError',
                                                                    'Wprowadź poprawy wiek!'
                                                                )
                                                                break
                                                            case age < 14 || age > 100:
                                                                updateHeadTeacher(
                                                                    id,
                                                                    'ageError',
                                                                    'Wiek musi mieścić się między 14 a 100!'
                                                                )
                                                                break
                                                            default:
                                                                updateHeadTeacher(
                                                                    id,
                                                                    'ageError',
                                                                    ''
                                                                )
                                                        }
                                                    }}
                                                />
                                            </>
                                        )}
                                        <HTPComposed.Detail label="E-mail" value={email} />
                                        {!isActivated && (
                                            <HeadTeacher.Button
                                                onClick={() => removeHeadTeacher(id, email)}
                                            >
                                                Usuń
                                            </HeadTeacher.Button>
                                        )}
                                    </HeadTeacher.DetailsContainer>
                                )
                            }
                        )
                    ) : (
                        <Dashboard.Warning>
                            W systemie nie ma jeszcze żadnego dyrektora!
                        </Dashboard.Warning>
                    )}
                </HeadTeacher.HeadTeachersContainer>
            )}
        </AdminHeadTeachersListContainer>
    )
}

export default compose(withMenu)(AdminHeadTeachersList)
