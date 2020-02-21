import React, { useEffect, useState } from 'react'
import styled, { css } from 'styled-components/macro'
import io from 'socket.io-client'

import { compose } from 'redux'
import { withRouter, withSocket, withFeedbackHandler } from '@hoc'

import { delayedApiAxios, delayedRedirectTo } from '@utils'

const TeacherContainer = styled.div`
    ${({ blurred }) => {
        if (blurred)
            return css`
                filter: blur(4px);
                transition: filter 0.5s linear;
            `
    }}
`

const Teacher = ({ children, socket, setSocket, shouldFeedbackHandlerAppear }) => {
    const [shouldChildrenAppear, setShouldChildrenAppear] = useState(false)
    useEffect(() => {
        const confirmToken = async () => {
            const url = '/api/confirmToken'
            const response = await delayedApiAxios.get(url)
            if (response) {
                const { role } = response.data
                if (role === 'guest' || role !== 'teacher') {
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
            <TeacherContainer blurred={shouldFeedbackHandlerAppear}>{children}</TeacherContainer>
        )
    )
}

export default compose(withRouter, withSocket, withFeedbackHandler)(Teacher)
