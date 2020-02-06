import React from 'react'
import styled from 'styled-components/macro'

import Dashboard from './styled/Dashboard'

const HeadTeacherProfileContainer = styled.section`
    width: 100%;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
`

const HeadTeacherProfile = () => {
    return <HeadTeacherProfileContainer>HeadTeacher</HeadTeacherProfileContainer>
}

export default HeadTeacherProfile
