import React, { useEffect, useState } from 'react'
import styled from 'styled-components/macro'

import { compose } from 'redux'
import { withMenu } from '@hoc'

import APDashboard from '@components/AdminProfile/styled/Dashboard'
import AHTCForm from '@components/AdminHeadTeacherCreator/styled/Form'
import HTSBMDashboard from '@components/HeadTeacherSchoolBellsManager/styled/Dashboard'

import AHTCComposed from '@components/AdminHeadTeacherCreator/composed'

import { apiAxios, delayedApiAxios, setFeedbackData, usePrevious } from '@utils'

const TeacherGradingSystemManagerContainer = styled(APDashboard.Container)`
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

const TeacherGradingSystemManager = ({ shouldMenuAppear }) => {
    const [isLoading, setIsLoading] = useState(true)
    const [gradingSystem, setGradingSystem] = useState([])
    const previousGradingSystem = usePrevious(gradingSystem)
    useEffect(() => {
        const getGradingSystem = async () => {
            const url = '/api/teacher/getGradingSystem'
            const response = await delayedApiAxios.get(url)
            if (response) {
                setIsLoading(false)
                const { gradingSystem } = response.data
                setGradingSystem(gradingSystem)
            }
        }
        getGradingSystem()
    }, [])
    const validate = () => {
        let isValidated = true
        setGradingSystem(
            gradingSystem.map((currentGradingSystem, index) => {
                if (
                    (index === 0 && parseInt(currentGradingSystem.to) !== 100) ||
                    (index === gradingSystem.length - 1 &&
                        parseInt(currentGradingSystem.from) !== 0)
                ) {
                    isValidated = false
                    return {
                        ...currentGradingSystem,
                        error: 'Wprowadź poprawny zakres!'
                    }
                }
                const nextGradingSystem = gradingSystem[index + 1]
                if (nextGradingSystem) {
                    const currentFrom = currentGradingSystem.from
                    const currentTo = currentGradingSystem.to
                    const nextTo = nextGradingSystem.to
                    if (
                        parseInt(currentFrom) < 0 ||
                        parseInt(currentFrom) > 100 ||
                        parseInt(currentTo) < 0 ||
                        parseInt(currentTo) > 100 ||
                        parseInt(currentTo) < parseInt(currentFrom) ||
                        parseInt(currentFrom) <= parseInt(nextTo) ||
                        parseInt(currentFrom) - parseInt(nextTo) > 1
                    ) {
                        isValidated = false
                        return {
                            ...currentGradingSystem,
                            error: 'Wprowadź poprawny zakres!'
                        }
                    } else {
                        return {
                            ...currentGradingSystem,
                            error: ''
                        }
                    }
                } else {
                    return {
                        ...currentGradingSystem,
                        error: ''
                    }
                }
            })
        )
        return isValidated
    }
    const handleSubmit = async e => {
        e.preventDefault()
        if (validate()) {
            const url = '/api/teacher/updateGradingSystem'
            const response = await apiAxios.post(url, {
                gradingSystem
            })
            if (response) {
                const { successMessage, gradingSystem } = response.data
                setFeedbackData(successMessage, 'Ok')
                setGradingSystem(gradingSystem)
            }
        }
    }
    const updateGradingSystem = (id, key, value) => {
        setGradingSystem(
            gradingSystem.map(gradingSystem =>
                gradingSystem.id === id
                    ? {
                          ...gradingSystem,
                          [key]: value
                      }
                    : gradingSystem
            )
        )
    }
    return (
        <TeacherGradingSystemManagerContainer withMenu={shouldMenuAppear}>
            {!isLoading && (
                <>
                    <APDashboard.Header>Twój system oceniania</APDashboard.Header>
                    <AHTCForm.Form onSubmit={handleSubmit}>
                        {gradingSystem.map(({ id, grade, from, to, error }) => {
                            return (
                                <HTSBMDashboard.InputsOuterContainer key={id}>
                                    <HTSBMDashboard.InputsContainer>
                                        <AHTCComposed.Input
                                            label={`${grade} od %`}
                                            value={from}
                                            placeholder="Wprowadź zakres..."
                                            onChange={from => updateGradingSystem(id, 'from', from)}
                                            double
                                        />
                                        <AHTCComposed.Input
                                            label="Do %"
                                            value={to}
                                            placeholder="Wprowadź zakres..."
                                            onChange={to => updateGradingSystem(id, 'to', to)}
                                            double
                                        />
                                    </HTSBMDashboard.InputsContainer>
                                    {error && <HTSBMDashboard.Error>{error}</HTSBMDashboard.Error>}
                                </HTSBMDashboard.InputsOuterContainer>
                            )
                        })}
                        {JSON.stringify(gradingSystem) !==
                            JSON.stringify(previousGradingSystem) && (
                            <AHTCForm.Submit>Zaktualizuj system oceniania</AHTCForm.Submit>
                        )}
                    </AHTCForm.Form>
                </>
            )}
        </TeacherGradingSystemManagerContainer>
    )
}

export default compose(withMenu)(TeacherGradingSystemManager)
