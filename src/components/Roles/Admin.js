import React, { useEffect, useState } from 'react'
import styled, { css } from 'styled-components/macro'
import axios from 'axios'

import { compose } from 'redux'
import { withRouter, withFeedbackHandler, withMenu } from 'hoc'

import APMenu from 'components/AdminProfile/styled/Menu'

import APComposed from 'components/AdminProfile/composed'

import { redirectTo, delayedRedirectTo, handleApiError } from 'utils'

const AdminContainer = styled.div`
    ${({ blurred }) => {
        if (blurred)
            return css`
                filter: blur(4px);
                transition: filter 0.5s linear;
            `
    }}
`

const Admin = ({ children, location, shouldFeedbackHandlerAppear, closeMenuOnClick }) => {
    const [shouldChildrenAppear, setShouldChildrenAppear] = useState(false)
    const [menuOptions] = useState([
        {
            option: 'Strona główna',
            pathname: '/admin/profil'
        },
        {
            option: 'Lista dyrektorów',
            pathname: '/admin/lista-dyrektorów'
        },
        {
            option: 'Utwórz dyrektora',
            pathname: '/admin/tworzenie-dyrektora'
        }
    ])
    useEffect(() => {
        const confirmToken = async () => {
            try {
                const url = '/api/confirmToken'
                const response = await axios.get(url)
                if (response) {
                    const { role } = response.data
                    if (role === 'guest' || role !== 'admin') {
                        return delayedRedirectTo('/')
                    }
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
            <AdminContainer blurred={shouldFeedbackHandlerAppear}>
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
            </AdminContainer>
        )
    )
}

export default compose(withRouter, withFeedbackHandler, withMenu)(Admin)
