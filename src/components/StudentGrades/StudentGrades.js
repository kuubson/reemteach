import React, { useEffect, useState } from 'react'
import styled from 'styled-components/macro'

import { compose } from 'redux'
import { withMenu } from 'hoc'

import APDashboard from 'components/AdminProfile/styled/Dashboard'
import AHTLDashboard from 'components/AdminHeadTeachersList/styled/Dashboard'

import HTPComposed from 'components/HeadTeacherProfile/composed'

import { delayedApiAxios } from 'utils'

const StudentGradesContainer = styled(APDashboard.Container)`
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
`

const StudentGrades = ({ shouldMenuAppear }) => {
    const [isLoading, setIsLoading] = useState(true)
    const [results, setResults] = useState([])
    useEffect(() => {
        const getResults = async () => {
            const url = '/api/student/getResults'
            const response = await delayedApiAxios.get(url)
            if (response) {
                setIsLoading(false)
                const { results } = response.data
                setResults(results)
            }
        }
        getResults()
    }, [])
    return (
        <StudentGradesContainer withMenu={shouldMenuAppear}>
            {!isLoading && (
                <AHTLDashboard.DetailsContainer>
                    {results.length > 0 ? (
                        results.map(
                            ({ id, grade, createdAt, teacher: { email, name, surname } }) => {
                                return (
                                    <div key={id}>
                                        <HTPComposed.Detail label="Ocena" value={grade} />
                                        <HTPComposed.Detail
                                            label="Nauczyciel"
                                            value={`${name} ${surname} 
                                            ( ${email} )`}
                                        />
                                        <HTPComposed.Detail
                                            label="Data otrzymania"
                                            value={new Date(createdAt).toLocaleString()}
                                        />
                                    </div>
                                )
                            }
                        )
                    ) : (
                        <AHTLDashboard.Warning>
                            Nie masz jeszcze żadnej oceny!
                        </AHTLDashboard.Warning>
                    )}
                </AHTLDashboard.DetailsContainer>
            )}
        </StudentGradesContainer>
    )
}

export default compose(withMenu)(StudentGrades)
