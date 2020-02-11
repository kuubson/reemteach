import React, { useEffect, useState } from 'react'
import styled from 'styled-components/macro'

import { compose } from 'redux'
import { withMenu } from '@hoc'

import Dashboard from './styled/Dashboard'
import Menu from './styled/Menu'

import Composed from './composed'

import { delayedApiAxios, redirectTo } from '@utils'

const AdminProfileContainer = styled(Dashboard.Container)`
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
`

const AdminProfile = ({ closeMenuOnClick, shouldMenuAppear }) => {
    const [isLoading, setIsLoading] = useState(true)
    const [email, setEmail] = useState('')
    useEffect(() => {
        const getProfile = async () => {
            const url = '/api/admin/getProfile'
            const response = await delayedApiAxios.get(url)
            if (response) {
                setIsLoading(false)
                const { email } = response.data
                setEmail(email)
            }
        }
        getProfile()
    }, [])
    return (
        <AdminProfileContainer withMenu={shouldMenuAppear}>
            <Composed.Menu>
                <Menu.Option
                    onClick={() => closeMenuOnClick(() => redirectTo('/admin/lista-dyrektorów'))}
                >
                    Lista dyrektorów
                </Menu.Option>
                <Menu.Option
                    onClick={() => closeMenuOnClick(() => redirectTo('/admin/dodawanie-dyrektora'))}
                >
                    Dodaj dyrektora
                </Menu.Option>
            </Composed.Menu>
            {!isLoading && (
                <Dashboard.Header>
                    Zalogowany jako <span>{email}</span>
                </Dashboard.Header>
            )}
        </AdminProfileContainer>
    )
}

export default compose(withMenu)(AdminProfile)
