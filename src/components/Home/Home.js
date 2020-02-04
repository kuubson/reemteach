import React, { useState } from 'react'
import styled from 'styled-components/macro'

import Dashboard from './styled/Dashboard'

import Composed from './composed'

const HomeContainer = styled.section`
    width: 100%;
    height: 100vh;
    overflow: hidden;
    padding: 0px 50px;
    perspective: 1500px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    position: relative;
`

const Home = () => {
    const [shouldHeadTeacherFormAppear, setShouldHeadTeacherFormAppear] = useState(false)
    const [shouldTeacherFormsAppear, setShouldTeacherFormsAppear] = useState(true)
    const [shouldStudentFormsAppear, setShouldStudentFormsAppear] = useState(false)
    return (
        <HomeContainer>
            <Dashboard.Header>Witaj w aplikacji Reemteach</Dashboard.Header>
            <Dashboard.Annotation>Wybierz swoją pozycję w szkole</Dashboard.Annotation>
            <Dashboard.ButtonsContainer>
                <Dashboard.Button onClick={() => setShouldHeadTeacherFormAppear(true)}>
                    Dyrektor
                </Dashboard.Button>
                <Dashboard.Button onClick={() => setShouldTeacherFormsAppear(true)}>
                    Nauczyciel
                </Dashboard.Button>
                <Dashboard.Button onClick={() => setShouldStudentFormsAppear(true)}>
                    Uczeń
                </Dashboard.Button>
            </Dashboard.ButtonsContainer>
            <Composed.HeadTeacherForm
                onClick={() => setShouldHeadTeacherFormAppear(false)}
                shouldSlideIn={shouldHeadTeacherFormAppear}
            />
            <Composed.TeacherForm
                onClick={() => setShouldTeacherFormsAppear(false)}
                shouldSlideIn={shouldTeacherFormsAppear}
            />
            <Composed.StudentForm
                onClick={() => setShouldStudentFormsAppear(false)}
                shouldSlideIn={shouldStudentFormsAppear}
            />
        </HomeContainer>
    )
}

export default Home
