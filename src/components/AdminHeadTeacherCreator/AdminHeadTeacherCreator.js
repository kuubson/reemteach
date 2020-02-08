import React from 'react'
import styled from 'styled-components/macro'

import { compose } from 'redux'
import { withMenu } from '@hoc'

import Dashboard from '@components/AdminProfile/styled/Dashboard'
import Menu from '@components/AdminProfile/styled/Menu'

import Composed from '@components/AdminProfile/composed'

import { redirectTo } from '@utils'

const AdminHeadTeacherCreatorContainer = styled(Dashboard.Container)`
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
`

const AdminHeadTeacherCreator = ({ shouldMenuAppear }) => {
    return (
        <AdminHeadTeacherCreatorContainer withMenu={shouldMenuAppear}>
            <Composed.Menu>
                <Menu.Option onClick={() => redirectTo('/admin/profil')}>Strona główna</Menu.Option>
            </Composed.Menu>
            <Dashboard.Header>Dodaj nowego dyrektora do systemu</Dashboard.Header>
        </AdminHeadTeacherCreatorContainer>
    )
}

export default compose(withMenu)(AdminHeadTeacherCreator)
