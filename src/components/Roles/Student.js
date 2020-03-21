import React, { useEffect, useState } from 'react'
import styled, { css } from 'styled-components/macro'
import io from 'socket.io-client'
import axios from 'axios'

import { compose } from 'redux'
import { withRouter, withSocket, withFeedbackHandler, withMenu } from '@hoc'

import APMenu from '@components/AdminProfile/styled/Menu'

import APComposed from '@components/AdminProfile/composed'

import {
    redirectTo,
    delayedRedirectTo,
    subscribePushNotifications,
    updateGeolocation,
    handleApiError
} from '@utils'

const StudentContainer = styled.div`
    ${({ blurred }) => {
        if (blurred)
            return css`
                filter: blur(4px);
                transition: filter 0.5s linear;
            `
    }}
`

const Student = ({
    children,
    socket,
    setSocket,
    location,
    shouldFeedbackHandlerAppear,
    closeMenuOnClick
}) => {
    const [shouldChildrenAppear, setShouldChildrenAppear] = useState(false)
    const [menuOptions] = useState([
        {
            option: 'Strona główna',
            pathname: '/uczeń/profil'
        },
        {
            option: 'Dołącz do testu',
            pathname: '/uczeń/test'
        },
        {
            option: 'Lista indywidualnych wykładów',
            pathname: '/uczeń/lista-indywidualnych-wykładów'
        },
        {
            option: 'Rozkład dzwonków',
            pathname: '/uczeń/rozkład-dzwonków'
        },
        {
            option: 'Czat',
            pathname: '/uczeń/czat'
        }
    ])
    useEffect(() => {
        if (!socket) {
            setSocket(io('/student'))
        }
        const confirmToken = async () => {
            try {
                const url = '/api/confirmToken'
                const response = await axios.get(url)
                if (response) {
                    const profilePathname = '/uczeń/profil'
                    const { role, isActivated } = response.data
                    if (role === 'guest' || role !== 'student') {
                        return delayedRedirectTo('/')
                    }
                    if (!isActivated && location.pathname !== profilePathname) {
                        return setTimeout(() => {
                            delayedRedirectTo(profilePathname)
                        }, 800)
                    }
                    subscribePushNotifications('/api/student/subscribeSchoolBells')
                    updateGeolocation(role)
                }
            } catch (error) {
                handleApiError(error)
            }
        }
        confirmToken()
        setTimeout(() => {
            setShouldChildrenAppear(true)
        }, 0)
    }, [])
    return (
        shouldChildrenAppear && (
            <StudentContainer blurred={shouldFeedbackHandlerAppear}>
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
            </StudentContainer>
        )
    )
}

export default compose(withRouter, withSocket, withFeedbackHandler, withMenu)(Student)
