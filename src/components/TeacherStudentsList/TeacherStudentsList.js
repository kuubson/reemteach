import React, { useEffect, useState } from 'react'
import styled from 'styled-components/macro'

import { compose } from 'redux'
import { withMenu } from '@hoc'

import APDashboard from '@components/AdminProfile/styled/Dashboard'
import AHTLDashboard from '@components/AdminHeadTeachersList/styled/Dashboard'
import HForm from '@components/Home/styled/Form'

import HTPComposed from '@components/HeadTeacherProfile/composed'

import { delayedApiAxios } from '@utils'

const TeacherStudentsListContainer = styled(APDashboard.Container)`
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
`

const TeacherStudentsList = ({ shouldMenuAppear }) => {
    const [isLoading, setIsLoading] = useState(true)
    const [schools, setSchools] = useState([])
    const [students, setStudents] = useState([])
    useEffect(() => {
        const getStudents = async () => {
            const url = '/api/teacher/getStudents'
            const response = await delayedApiAxios.get(url)
            if (response) {
                setIsLoading(false)
                const { schools } = response.data
                setSchools(schools)
            }
        }
        getStudents()
    }, [])
    return (
        <TeacherStudentsListContainer withMenu={shouldMenuAppear} withMorePadding>
            {students.length > 0 && <HForm.CloseButton onClick={() => setStudents([])} black />}
            {!isLoading && (
                <AHTLDashboard.DetailsContainer>
                    {students.length > 0 ? (
                        students.map(({ id, email, name, surname }) => (
                            <div key={id}>
                                <HTPComposed.Detail label="E-mail" value={email} />
                                <HTPComposed.Detail label="Imię" value={name} />
                                <HTPComposed.Detail label="Nazwisko" value={surname} />
                            </div>
                        ))
                    ) : schools.length > 0 ? (
                        schools.map(({ id, name, grades }) => (
                            <div key={id}>
                                <HTPComposed.Detail label="Szkoła" value={name} />
                                {grades.map(({ grade, students }) => (
                                    <div key={grade}>
                                        <HTPComposed.Detail
                                            label="Klasa"
                                            value={grade}
                                            onClick={() => setStudents(students)}
                                            withPointer
                                        />
                                        <AHTLDashboard.Button>
                                            Rozpocznij wykład
                                        </AHTLDashboard.Button>
                                    </div>
                                ))}
                            </div>
                        ))
                    ) : (
                        <AHTLDashboard.Warning>
                            Nie należysz do żadnej szkoły!
                        </AHTLDashboard.Warning>
                    )}
                </AHTLDashboard.DetailsContainer>
            )}
        </TeacherStudentsListContainer>
    )
}

export default compose(withMenu)(TeacherStudentsList)
