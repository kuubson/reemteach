import React from 'react'
import styled from 'styled-components/macro'

import Dashboard from './styled/Dashboard'

const TeacherProfileContainer = styled.section`
    width: 100%;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
`

const TeacherProfile = () => {
    return <TeacherProfileContainer>Nauczyciel</TeacherProfileContainer>
}

export default TeacherProfile
