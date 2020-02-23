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
    const [menuOptions, setMenuOptions] = useState([
        {
            option: 'Strona główna',
            pathname: '/dyrektor/profil'
        }
    ])
    useEffect(() => {
        const confirmToken = async () => {
            const url = '/api/confirmToken'
            const response = await delayedApiAxios.get(url)
            if (response) {
                const profilePathname = '/dyrektor/profil'
                const { role, isActivated, hasSchool } = response.data
                if (role === 'guest' || role !== 'headTeacher') {
                    delayedRedirectTo('/')
                }
                if (!isActivated && location.pathname !== profilePathname) {
                    setTimeout(() => {
                        delayedRedirectTo(profilePathname)
                    }, 800)
                }
                if (!hasSchool) {
                    setMenuOptions([
                        ...menuOptions,
                        {
                            option: 'Utwórz szkołę',
                            pathname: '/dyrektor/tworzenie-szkoły'
                        }
                    ])
                }
                if (hasSchool) {
                    setMenuOptions([
                        ...menuOptions,
                        {
                            option: 'Twoja szkoła',
                            pathname: '/dyrektor/zarządzanie-szkołą'
                        },
                        {
                            option: 'Lista nauczycieli',
                            pathname: '/dyrektor/lista-nauczycieli'
                        },
                        {
                            option: 'Utwórz nauczyciela',
                            pathname: '/dyrektor/tworzenie-nauczyciela'
                        },
                        {
                            option: 'Zarządzaj dzwonkami',
                            pathname: '/dyrektor/zarządzanie-dzwonkami-w-szkole'
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
