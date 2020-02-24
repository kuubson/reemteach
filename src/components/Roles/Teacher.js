import React, { useEffect, useState } from 'react'
import styled, { css } from 'styled-components/macro'
import io from 'socket.io-client'

import { compose } from 'redux'
import { withRouter, withSocket, withFeedbackHandler, withMenu } from '@hoc'

import APMenu from '@components/AdminProfile/styled/Menu'

import APComposed from '@components/AdminProfile/composed'

import { delayedApiAxios, redirectTo, delayedRedirectTo } from '@utils'

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
    const [menuOptions] = useState([
        {
            option: 'Strona główna',
            pathname: '/nauczyciel/profil'
        },
        {
            option: 'Lista szkół',
            pathname: '/nauczyciel/lista-szkół'
        },
        {
            option: 'Utwórz ucznia',
            pathname: '/nauczyciel/tworzenie-ucznia'
        }
    ])
    useEffect(() => {
        const confirmToken = async () => {
            const url = '/api/confirmToken'
            const response = await delayedApiAxios.get(url)
            if (response) {
                const profilePathname = '/nauczyciel/profil'
                const { role, isActivated } = response.data
                if (role === 'guest' || role !== 'teacher') {
                    delayedRedirectTo('/')
                }
                if (!isActivated && location.pathname !== profilePathname) {
                    setTimeout(() => {
                        delayedRedirectTo(profilePathname)
                    }, 800)
                }
            }
        }
        confirmToken()
        setTimeout(() => {
            setShouldChildrenAppear(true)
            if (!socket) {
                setSocket(io())
            }
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
