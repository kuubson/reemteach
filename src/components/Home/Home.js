import React, { useState } from 'react'
import styled from 'styled-components/macro'

import Dashboard from './styled/Dashboard'

import Composed from './composed'

const HomeContainer = styled.section`
    width: 100%;
    height: 100vh;
    padding: 0px 50px;
    perspective: 1500px;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
`

const Home = () => {
    const [shouldAdminFormAppear, setShouldAdminFormAppear] = useState(false)
    const [shouldHeadTeacherFormAppear, setShouldHeadTeacherFormAppear] = useState(false)
    const [shouldTeacherFormAppear, setShouldTeacherFormAppear] = useState(false)
    const [shouldStudentFormAppear, setShouldStudentFormAppear] = useState(false)
    return (
        <HomeContainer>
            <Dashboard.Header>Witaj w aplikacji Reemteach</Dashboard.Header>
            <Dashboard.Annotation>Wybierz swoją pozycję w szkole</Dashboard.Annotation>
            <Dashboard.ButtonsContainer>
                <Dashboard.AdminButton onDoubleClick={() => setShouldAdminFormAppear(true)} />
                <Dashboard.Button onClick={() => setShouldHeadTeacherFormAppear(true)}>
                    Dyrektor
                </Dashboard.Button>
                <Dashboard.Button onClick={() => setShouldTeacherFormAppear(true)}>
                    Nauczyciel
                </Dashboard.Button>
                <Dashboard.Button onClick={() => setShouldStudentFormAppear(true)}>
                    Uczeń
                </Dashboard.Button>
            </Dashboard.ButtonsContainer>
            <Composed.AdminForm
                onClick={() => setShouldAdminFormAppear(false)}
                shouldSlideIn={shouldAdminFormAppear}
            />
            <Composed.HeadTeacherForm
                onClick={() => setShouldHeadTeacherFormAppear(false)}
                shouldSlideIn={shouldHeadTeacherFormAppear}
            />
            <Composed.TeacherForm
                onClick={() => setShouldTeacherFormAppear(false)}
                shouldSlideIn={shouldTeacherFormAppear}
            />
            <Composed.StudentForm
                onClick={() => setShouldStudentFormAppear(false)}
                shouldSlideIn={shouldStudentFormAppear}
            />
        </HomeContainer>
    )
}

export default Home
