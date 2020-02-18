import React, { useEffect, useState } from 'react'
import styled from 'styled-components/macro'

import { compose } from 'redux'
import { withMenu } from '@hoc'

import APDashboard from '@components/AdminProfile/styled/Dashboard'
import APMenu from '@components/AdminProfile/styled/Menu'
import HTPDetail from '@components/HeadTeacherProfile/styled/Detail'

import APComposed from '@components/AdminProfile/composed'
import HTPComposed from '@components/HeadTeacherProfile/composed'

import { delayedApiAxios, redirectTo, setFeedbackData } from '@utils'

const HeadTeacherProfileContainer = styled(APDashboard.Container)`
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
`

const HeadTeacherProfile = ({ closeMenuOnClick, shouldMenuAppear }) => {
    const [isLoading, setIsLoading] = useState(true)
    const [name, setName] = useState('')
    const [type, setType] = useState('')
    const [description, setDescription] = useState('')
    const [creationDate, setCreationDate] = useState('')
    const [nameError, setNameError] = useState('')
    const [typeError, setTypeError] = useState('')
    const [descriptionError, setDescriptionError] = useState('')
    const [creationDateError, setCreationDateError] = useState('')
    useEffect(() => {
        const getSchool = async () => {
            const url = '/api/headTeacher/getSchool'
            const response = await delayedApiAxios.get(url)
            if (response) {
                setIsLoading(false)
                const { name, type, description, creationDate, hasSchool } = response.data
                if (!hasSchool) {
                    setFeedbackData('Musisz utworzyć najpierw szkołę w systemie!', 'Ok')
                    redirectTo('/dyrektor/tworzenie-szkoły')
                }
                setName(name)
                setType(type)
                setDescription(description)
                setCreationDate(creationDate)
            }
        }
        getSchool()
    }, [])
    return (
        <HeadTeacherProfileContainer withMenu={shouldMenuAppear}>
            <APComposed.Menu>
                <APMenu.Option
                    onClick={() => closeMenuOnClick(() => redirectTo('/dyrektor/profil'))}
                >
                    Strona główna
                </APMenu.Option>
            </APComposed.Menu>
            {!isLoading && (
                <>
                    <APDashboard.Header>Dane twojej szkoły:</APDashboard.Header>
                    <HTPDetail.DetailsContainer>
                        <HTPComposed.EditableDetail
                            label="Nazwa szkoły"
                            value={name}
                            error={nameError}
                            onChange={setName}
                        />
                        <HTPComposed.EditableDetail
                            label="Rodzaj szkoły"
                            value={type}
                            error={typeError}
                            onChange={setType}
                        />
                        <HTPComposed.EditableDetail
                            label="Opis szkoły"
                            value={description}
                            error={descriptionError}
                            onChange={setDescription}
                        />
                        <HTPComposed.EditableDetail
                            label="Data utworzenia"
                            value={creationDate}
                            error={creationDateError}
                            onChange={setCreationDate}
                        />
                    </HTPDetail.DetailsContainer>
                </>
            )}
        </HeadTeacherProfileContainer>
    )
}

export default compose(withMenu)(HeadTeacherProfile)
