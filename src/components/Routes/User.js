import React, { useEffect, useState } from 'react'
import styled, { css } from 'styled-components/macro'
import io from 'socket.io-client'

import { compose } from 'redux'
import { withRouter, withSocket, withFeedbackHandler } from '@hoc'

import { delayedApiAxios, delayedRedirectTo } from '@utils'

const UserContainer = styled.div`
    ${({ blurred }) => {
        if (blurred)
            return css`
                filter: blur(4px);
                transition: filter 0.5s linear;
            `
    }}
`

const User = ({
    children,
    role: roleToConfirm,
    location,
    socket,
    setSocket,
    shouldFeedbackHandlerAppear
}) => {
    const [shouldChildrenAppear, setShouldChildrenAppear] = useState(false)
    useEffect(() => {
        const confirmToken = async () => {
            const url = '/api/confirmToken'
            const response = await delayedApiAxios.get(url)
            if (response) {
                const { role, isActivated } = response.data
                if (role === 'guest' || role !== roleToConfirm) {
                    delayedRedirectTo('/')
                }
                if (role === 'headTeacher') {
                    if (!isActivated && location.pathname !== '/dyrektor/profil') {
                        setTimeout(() => {
                            delayedRedirectTo('/dyrektor/profil')
                        }, 800)
                    }
                }
            }
        }
        confirmToken()
        setTimeout(() => {
            setShouldChildrenAppear(true)
        }, 0)
    }, [])
    useEffect(() => {
        if (!socket) {
            setSocket(io())
        }
    }, [socket])
    return (
        shouldChildrenAppear && (
            <UserContainer blurred={shouldFeedbackHandlerAppear}>{children}</UserContainer>
        )
    )
}

export default compose(withRouter, withSocket, withFeedbackHandler)(User)
