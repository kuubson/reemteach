import React from 'react'
import styled from 'styled-components/macro'

import Dashboard from './styled/Dashboard'

const AdminProfileContainer = styled.section`
    width: 100%;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
`

const AdminProfile = () => {
    return <AdminProfileContainer>Admin</AdminProfileContainer>
}

export default AdminProfile
