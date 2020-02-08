import React, { useEffect, useState } from 'react'
import styled, { css } from 'styled-components/macro'
import io from 'socket.io-client'

import { compose } from 'redux'
import { withFeedbackHandler, withSocket } from '@hoc'

import { delayedApiAxios, redirectTo } from '@utils'

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
    shouldFeedbackHandlerAppear,
    socket,
    setSocket,
    role: roleToConfirm
}) => {
    const [shouldChildrenAppear, setShouldChildrenAppear] = useState(false)
    useEffect(() => {
        const confirmToken = async () => {
            const url = '/api/confirmToken'
            const RESPONSE = await delayedApiAxios.get(url)
            if (RESPONSE) {
                const { role } = RESPONSE.data
                if (role === 'guest' || role !== roleToConfirm) {
                    redirectTo('/')
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

export default compose(withFeedbackHandler, withSocket)(User)
