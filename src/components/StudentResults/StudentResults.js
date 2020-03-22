import React, { useEffect, useState } from 'react'
import styled from 'styled-components/macro'

import { compose } from 'redux'
import { withMenu } from '@hoc'

import APDashboard from '@components/AdminProfile/styled/Dashboard'
import AHTLDashboard from '@components/AdminHeadTeachersList/styled/Dashboard'
import AHTCForm from '@components/AdminHeadTeacherCreator/styled/Form'
import HForm from '@components/Home/styled/Form'
import HTSBMDashboard from '@components/HeadTeacherSchoolBellsManager/styled/Dashboard'

import HTPComposed from '@components/HeadTeacherProfile/composed'
import AHTCComposed from '@components/AdminHeadTeacherCreator/composed'

import { delayedApiAxios } from '@utils'

const StudentResultsContainer = styled(APDashboard.Container)`
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
`

const StudentResults = ({ shouldMenuAppear }) => {
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
        <StudentResultsContainer withMenu={shouldMenuAppear}>
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
                            Nie masz jeszcze żadnych ocen!
                        </AHTLDashboard.Warning>
                    )}
                </AHTLDashboard.DetailsContainer>
            )}
        </StudentResultsContainer>
    )
}

export default compose(withMenu)(StudentResults)
