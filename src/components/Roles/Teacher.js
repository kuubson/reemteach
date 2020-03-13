import React, { useEffect, useState } from 'react'
import styled, { css } from 'styled-components/macro'
import io from 'socket.io-client'
import axios from 'axios'

import { compose } from 'redux'
import { withRouter, withSocket, withFeedbackHandler, withMenu } from '@hoc'

import APMenu from '@components/AdminProfile/styled/Menu'

import APComposed from '@components/AdminProfile/composed'

import { redirectTo, delayedRedirectTo } from '@utils'

const TeacherContainer = styled.div`
    ${({ blurred }) => {
        if (blurred)
            return css`
                filter: blur(4px);
                transition: filter 0.5s linear;
            `
    }}
`

const Teacher = ({
    children,
    socket,
    setSocket,
    location,
    shouldFeedbackHandlerAppear,
    closeMenuOnClick
}) => {
    const [shouldChildrenAppear, setShouldChildrenAppear] = useState(false)
    const [menuOptions, setMenuOptions] = useState([
        {
            option: 'Baza pytań',
            pathname: '/nauczyciel/baza-pytań'
        },
        {
            option: 'Twoja baza pytań',
            pathname: '/nauczyciel/twoja-baza-pytań'
        },
        {
            option: 'Utwórz pytanie',
            pathname: '/nauczyciel/tworzenie-pytania'
        },
        {
            option: 'Utwórz Test',
            pathname: '/nauczyciel/tworzenie-testu'
        },
        {
            option: 'Strona główna',
            pathname: '/nauczyciel/profil'
        },
        {
            option: 'Lista szkół',
            pathname: '/nauczyciel/lista-szkół'
        },
        {
            option: 'Lista uczniów',
            pathname: '/nauczyciel/lista-uczniów'
        }
    ])
    useEffect(() => {
        if (!socket) {
            setSocket(io('/teacher'))
        }
        const confirmToken = async () => {
            const url = '/api/confirmToken'
            const response = await axios.get(url)
            if (response) {
                const profilePathname = '/nauczyciel/profil'
                const { role, isActivated, hasSchools } = response.data
                if (role === 'guest' || role !== 'teacher') {
                    return delayedRedirectTo('/')
                }
                if (!isActivated && location.pathname !== profilePathname) {
                    return setTimeout(() => {
                        delayedRedirectTo(profilePathname)
                    }, 800)
                }
                if (hasSchools) {
                    setMenuOptions([
                        ...menuOptions,
                        {
                            option: 'Utwórz ucznia',
                            pathname: '/nauczyciel/tworzenie-ucznia'
                        }
                    ])
                }
            }
        }
        confirmToken()
        setTimeout(() => {
            setShouldChildrenAppear(true)
        }, 0)
    }, [])
    return (
        shouldChildrenAppear && (
            <TeacherContainer blurred={shouldFeedbackHandlerAppear}>
                <APComposed.Menu>
                    {menuOptions.map(
                        ({ pathname, option }) =>
                            location.pathname !== pathname && (
                                <APMenu.Option
                                    key={option}
                                    onClick={() => closeMenuOnClick(() => redirectTo(pathname))}
                                >
                                    {option}
                                </APMenu.Option>
                            )
                    )}
                </APComposed.Menu>
                {children}
            </TeacherContainer>
        )
    )
}

export default compose(withRouter, withSocket, withFeedbackHandler, withMenu)(Teacher)
