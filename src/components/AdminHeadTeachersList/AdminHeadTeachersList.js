import React, { useEffect, useState } from 'react'
import styled from 'styled-components/macro'

import { compose } from 'redux'
import { withMenu } from '@hoc'

import APDashboard from '@components/AdminProfile/styled/Dashboard'
import APMenu from '@components/AdminProfile/styled/Menu'
import Dashboard from './styled/Dashboard'
import HeadTeacher from './styled/HeadTeacher'

import APComposed from '@components/AdminProfile/composed'

import { delayedApiAxios, redirectTo } from '@utils'

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
    return (
        <AdminHeadTeachersListContainer withMenu={shouldMenuAppear}>
            <APComposed.Menu>
                <APMenu.Option onClick={() => closeMenuOnClick(() => redirectTo('/admin/profil'))}>
                    Strona główna
                </APMenu.Option>
                <APMenu.Option
                    onClick={() => closeMenuOnClick(() => redirectTo('/admin/dodawanie-dyrektora'))}
                >
                    Dodaj dyrektora
                </APMenu.Option>
            </APComposed.Menu>
            {!isLoading && (
                <HeadTeacher.HeadTeachersContainer>
                    {headTeachers.length > 0 ? (
                        headTeachers.map(({ email }) => {
                            return <p>{email}</p>
                        })
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
