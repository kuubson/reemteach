import React, { useEffect, useState } from 'react'
import styled from 'styled-components/macro'

import { compose } from 'redux'
import { withMenu } from '@hoc'

import Dashboard from './styled/Dashboard'
import Menu from './styled/Menu'

import Composed from './composed'

import { apiAxios, redirectTo } from '@utils'

const AdminProfileContainer = styled(Dashboard.Container)`
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
`

const AdminProfile = ({ shouldMenuAppear }) => {
    const [email, setEmail] = useState('')
    useEffect(() => {
        const getProfile = async () => {
            const url = '/api/admin/getProfile'
            const response = await apiAxios.get(url)
            if (response) {
                const { email } = response.data
                setEmail(email)
            }
        }
        getProfile()
    }, [])
    return (
        <AdminProfileContainer withMenu={shouldMenuAppear}>
            <Composed.Menu>
                <Menu.Option onClick={() => redirectTo('/admin/dodawanie-dyrektora')}>
                    Dodaj dyrektora
                </Menu.Option>
            </Composed.Menu>
            <Dashboard.Header>
                Zalogowany jako <span>{email}</span>
            </Dashboard.Header>
        </AdminProfileContainer>
    )
}

export default compose(withMenu)(AdminProfile)
