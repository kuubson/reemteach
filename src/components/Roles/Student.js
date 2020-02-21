import React, { useEffect, useState } from 'react'
import styled, { css } from 'styled-components/macro'
import io from 'socket.io-client'

import { compose } from 'redux'
import { withRouter, withSocket, withFeedbackHandler } from '@hoc'

import { delayedApiAxios, delayedRedirectTo } from '@utils'

const StudentContainer = styled.div`
    ${({ blurred }) => {
        if (blurred)
            return css`
                filter: blur(4px);
                transition: filter 0.5s linear;
            `
    }}
`

const Student = ({ children, socket, setSocket, shouldFeedbackHandlerAppear }) => {
    const [shouldChildrenAppear, setShouldChildrenAppear] = useState(false)
    useEffect(() => {
        const confirmToken = async () => {
            const url = '/api/confirmToken'
            const response = await delayedApiAxios.get(url)
            if (response) {
                const { role } = response.data
                if (role === 'guest' || role !== 'student') {
                    delayedRedirectTo('/')
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
            <StudentContainer blurred={shouldFeedbackHandlerAppear}>{children}</StudentContainer>
        )
    )
}

export default compose(withRouter, withSocket, withFeedbackHandler)(Student)
