import React, { useEffect, useState } from 'react'
import styled from 'styled-components/macro'
import moment from 'moment'

import { compose } from 'redux'
import { withMenu } from '@hoc'

import APDashboard from '@components/AdminProfile/styled/Dashboard'
import AHTCForm from '@components/AdminHeadTeacherCreator/styled/Form'
import Dashboard from './styled/Dashboard'

import AHTCComposed from '@components/AdminHeadTeacherCreator/composed'

import {
    apiAxios,
    delayedApiAxios,
    setFeedbackData,
    setConfirmationPopupData,
    usePrevious
} from '@utils'

const HeadTeacherSchoolBellsManagerContainer = styled(APDashboard.Container)`
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

const HeadTeacherSchoolBellsManager = ({ shouldMenuAppear }) => {
    const [isLoading, setIsLoading] = useState(true)
    const [schoolBells, setSchoolBells] = useState([])
    const previousSchoolBells = usePrevious(schoolBells)
    useEffect(() => {
        const getSchoolBells = async () => {
            const url = '/api/headTeacher/getSchoolBells'
            const response = await delayedApiAxios.get(url)
            if (response) {
                setIsLoading(false)
                const { schoolBells } = response.data
                setSchoolBells(schoolBells)
            }
        }
        getSchoolBells()
    }, [])
    const validate = () => {
        let isValidated = true
        setSchoolBells(
            schoolBells.map(schoolBell => {
                if (
                    !moment(schoolBell.from, 'HH:mm', true).isValid() ||
                    !moment(schoolBell.to, 'HH:mm', true).isValid()
                ) {
                    isValidated = false
                    return {
                        ...schoolBell,
                        error: 'Wprowadź poprawne godziny!'
                    }
                } else {
                    return {
                        ...schoolBell,
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
            const url = '/api/headTeacher/updateSchoolBells'
            const response = await apiAxios.post(url, {
                schoolBells
            })
            if (response) {
                const { successMessage } = response.data
                setFeedbackData(successMessage, 'Ok')
            }
        }
    }
    const removeSchoolBell = (id, from, to, isRecess) => {
        setConfirmationPopupData(
            `Czy napewno chcesz usunąć tę ${isRecess ? 'przerwę' : 'lekcję'} ${
                from ? `od ${from}` : ''
            } ${to ? `do ${to}` : ''} z rozkładu dzwonków?`,
            'Tak',
            'Nie',
            () => setSchoolBells(schoolBells.filter(schoolBell => schoolBell.id !== id))
        )
    }
    const addSchoolBell = isRecess => {
        setSchoolBells([
            ...schoolBells,
            {
                id: schoolBells.length + 1,
                from: '',
                to: '',
                isRecess
            }
        ])
    }
    const updateSchoolBell = (id, key, value) => {
        setSchoolBells(
            schoolBells.map(schoolBell =>
                schoolBell.id === id
                    ? {
                          ...schoolBell,
                          [key]: value
                      }
                    : schoolBell
            )
        )
    }
    return (
        <HeadTeacherSchoolBellsManagerContainer withMenu={shouldMenuAppear} withMorePadding>
            {!isLoading && (
                <>
                    <APDashboard.Header>Zaktualizuj dzwonki w szkole</APDashboard.Header>
                    <AHTCForm.Form onSubmit={handleSubmit}>
                        {schoolBells.map(({ id, from, to, isRecess, error }, index) => {
                            return (
                                <div key={id}>
                                    <Dashboard.InputsContainer>
                                        <AHTCComposed.Input
                                            label="Od"
                                            value={from}
                                            placeholder="Wprowadź godzinę..."
                                            onChange={from => updateSchoolBell(id, 'from', from)}
                                            double
                                        />
                                        <AHTCComposed.Input
                                            label="Do"
                                            value={to}
                                            placeholder="Wprowadź godzinę..."
                                            onChange={to => updateSchoolBell(id, 'to', to)}
                                            double
                                        />
                                        <Dashboard.RemoveButton
                                            onClick={() => removeSchoolBell(id, from, to, isRecess)}
                                            visible={index !== 0}
                                            withRecess={isRecess}
                                        />
                                    </Dashboard.InputsContainer>
                                    {error && <Dashboard.Error>{error}</Dashboard.Error>}
                                </div>
                            )
                        })}
                        <AHTCForm.Submit
                            onClick={e => {
                                e.preventDefault()
                                addSchoolBell(false)
                            }}
                        >
                            Dodaj lekcję
                        </AHTCForm.Submit>
                        <AHTCForm.Submit
                            onClick={e => {
                                e.preventDefault()
                                addSchoolBell(true)
                            }}
                            withLessMargin
                        >
                            Dodaj przerwę
                        </AHTCForm.Submit>
                        {previousSchoolBells && schoolBells !== previousSchoolBells && (
                            <AHTCForm.Submit withLessMargin>Zaktualizuj dzwonki</AHTCForm.Submit>
                        )}
                    </AHTCForm.Form>
                </>
            )}
        </HeadTeacherSchoolBellsManagerContainer>
    )
}

export default compose(withMenu)(HeadTeacherSchoolBellsManager)
