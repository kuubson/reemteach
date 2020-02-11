import React from 'react'
import styled from 'styled-components/macro'

import Dashboard from './styled/Dashboard'

const StudentProfileContainer = styled.section`
    width: 100%;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
`

const StudentProfile = () => {
    return <StudentProfileContainer>Uczeń</StudentProfileContainer>
}

export default StudentProfile
