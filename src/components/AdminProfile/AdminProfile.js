import React, { useEffect, useState } from 'react'
import styled from 'styled-components/macro'

import { compose } from 'redux'
import { withMenu } from '@hoc'

import Dashboard from './styled/Dashboard'
import Menu from './styled/Menu'

import Composed from './composed'

import { apiAxios } from '@utils'

const AdminProfileContainer = styled.section`
    width: ${({ withMenu }) => (withMenu ? 'calc(100% - 350px)' : '100%')};
    height: 100vh;
    padding: 0px 40px;
    margin-left: ${({ withMenu }) => (withMenu ? '350px' : '0px')};
    transition: width 0.8s ease-in-out, margin-left 0.8s ease-in-out;
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
                <Menu.Option>Dodaj dyrektora</Menu.Option>
            </Composed.Menu>
            {email && (
                <Dashboard.Header>
                    Zalogowany jako <span>{email}</span>
                </Dashboard.Header>
            )}
        </AdminProfileContainer>
    )
}

export default compose(withMenu)(AdminProfile)
