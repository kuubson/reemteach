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

import { delayedApiAxios, setFeedbackData, setConfirmationPopupData, redirectTo } from '@utils'

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
                const response = await delayedApiAxios.post(url, {
                    id,
                    email
                })
                if (response) {
                    const { successMessage } = response.data
                    setFeedbackData(successMessage, 'Ok')
                }
            }
        )
    }
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
                        headTeachers.map(({ isActivated, id, email, name, surname, age }) => (
                            <HeadTeacher.DetailsContainer key={id}>
                                <HTPComposed.Detail label="Id:" value={id} />
                                {isActivated && (
                                    <>
                                        <HTPComposed.Detail label="Imię:" value={name} />
                                        <HTPComposed.Detail label="Nazwisko:" value={surname} />
                                        <HTPComposed.Detail label="Wiek:" value={age} />
                                    </>
                                )}
                                <HTPComposed.Detail label="E-mail:" value={email} />
                                {!isActivated && (
                                    <HeadTeacher.Button
                                        onClick={() => removeHeadTeacher(id, email)}
                                    >
                                        Usuń
                                    </HeadTeacher.Button>
                                )}
                            </HeadTeacher.DetailsContainer>
                        ))
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
