import React, { useEffect, useState } from 'react'
import styled from 'styled-components/macro'

import { compose } from 'redux'
import { withMenu } from '@hoc'

import APDashboard from '@components/AdminProfile/styled/Dashboard'
import AHTCForm from '@components/AdminHeadTeacherCreator/styled/Form'
import AHTLDashboard from '@components/AdminHeadTeachersList/styled/Dashboard'
import HTSBMDashboard from '@components/HeadTeacherSchoolBellsManager/styled/Dashboard'

import AHTCComposed from '@components/AdminHeadTeacherCreator/composed'

import { delayedApiAxios } from '@utils'

const StudentSchoolBellsListContainer = styled(APDashboard.Container)`
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    @media (max-width: 500px) {
        padding-right: 25px;
        padding-left: 25px;
    }
`

const StudentSchoolBellsList = ({ shouldMenuAppear }) => {
    const [isLoading, setIsLoading] = useState(true)
    const [schoolBells, setSchoolBells] = useState([])
    useEffect(() => {
        const getSchoolBells = async () => {
            const url = '/api/student/getSchoolBells'
            const response = await delayedApiAxios.get(url)
            if (response) {
                setIsLoading(false)
                const { schoolBells } = response.data
                setSchoolBells(schoolBells)
            }
        }
        getSchoolBells()
    }, [])
    return (
        <StudentSchoolBellsListContainer withMenu={shouldMenuAppear}>
            {!isLoading &&
                (schoolBells.length > 0 ? (
                    <>
                        <APDashboard.Header>Rozkład dzwonków w Twojej szkole</APDashboard.Header>
                        <AHTCForm.Form>
                            {schoolBells.map(({ id, from, to, isRecess }) => {
                                return (
                                    <HTSBMDashboard.InputsOuterContainer key={id}>
                                        <HTSBMDashboard.InputsContainer withoutError>
                                            <AHTCComposed.Input
                                                label={`${isRecess ? 'Przerwa' : 'Lekcja'} od`}
                                                value={from}
                                                placeholder="Wprowadź godzinę..."
                                                double
                                                readOnly
                                            />
                                            <AHTCComposed.Input
                                                label="Do"
                                                value={to}
                                                placeholder="Wprowadź godzinę..."
                                                readOnly
                                            />
                                        </HTSBMDashboard.InputsContainer>
                                    </HTSBMDashboard.InputsOuterContainer>
                                )
                            })}
                        </AHTCForm.Form>
                    </>
                ) : (
                    <AHTLDashboard.Warning>
                        W szkole nie ma jeszcze żadnego dzwonka!
                    </AHTLDashboard.Warning>
                ))}
        </StudentSchoolBellsListContainer>
    )
}

export default compose(withMenu)(StudentSchoolBellsList)
