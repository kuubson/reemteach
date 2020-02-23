import React, { useEffect, useState } from 'react'
import styled, { css } from 'styled-components/macro'

import { compose } from 'redux'
import { withRouter, withFeedbackHandler, withMenu } from '@hoc'

import APMenu from '@components/AdminProfile/styled/Menu'

import APComposed from '@components/AdminProfile/composed'

import { delayedApiAxios, redirectTo, delayedRedirectTo } from '@utils'

const HeadTeacherContainer = styled.div`
    ${({ blurred }) => {
        if (blurred)
            return css`
                filter: blur(4px);
                transition: filter 0.5s linear;
            `
    }}
`

const HeadTeacher = ({ children, location, shouldFeedbackHandlerAppear, closeMenuOnClick }) => {
    const [shouldChildrenAppear, setShouldChildrenAppear] = useState(false)
    const [menuOptions] = useState([
        {
            option: 'Strona główna',
            pathname: '/nauczyciel/profil'
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
        }, 0)
    }, [])
    return (
        shouldChildrenAppear && (
            <HeadTeacherContainer blurred={shouldFeedbackHandlerAppear}>
                <APComposed.Menu>
                    {menuOptions.map(
                        ({ pathname, option }) =>
                            location.pathname !== pathname && (
                                <APMenu.Option
                                    onClick={() => closeMenuOnClick(() => redirectTo(pathname))}
                                >
                                    {option}
                                </APMenu.Option>
                            )
                    )}
                </APComposed.Menu>
                {children}
            </HeadTeacherContainer>
        )
    )
}

export default compose(withRouter, withFeedbackHandler, withMenu)(HeadTeacher)
