import React, { useEffect, useState } from 'react'
import styled from 'styled-components/macro'

import { compose } from 'redux'
import { withMenu } from '@hoc'

import APDashboard from '@components/AdminProfile/styled/Dashboard'
import APMenu from '@components/AdminProfile/styled/Menu'

import APComposed from '@components/AdminProfile/composed'

import { delayedApiAxios, redirectTo } from '@utils'

const HeadTeacherProfileContainer = styled(APDashboard.Container)`
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
`

const HeadTeacherProfile = ({ closeMenuOnClick, shouldMenuAppear }) => {
    const [isLoading, setIsLoading] = useState(true)
    const [email, setEmail] = useState('')
    useEffect(() => {
        const getProfile = async () => {
            const url = '/api/headTeacher/getProfile'
            const response = await delayedApiAxios.get(url)
            if (response) {
                setIsLoading(false)
                const { email } = response.data
                setEmail(email)
            }
        }
        getProfile()
    }, [])
    return (
        <HeadTeacherProfileContainer withMenu={shouldMenuAppear}>
            <APComposed.Menu>
                <APMenu.Option
                    onClick={() => closeMenuOnClick(() => redirectTo('/dyrektor/tworzenie-szkoły'))}
                >
                    Utwórz szkołę
                </APMenu.Option>
            </APComposed.Menu>
            {!isLoading && (
                <APDashboard.Header>
                    Zalogowany jako <span>{email}</span>
                </APDashboard.Header>
            )}
        </HeadTeacherProfileContainer>
    )
}

export default compose(withMenu)(HeadTeacherProfile)
