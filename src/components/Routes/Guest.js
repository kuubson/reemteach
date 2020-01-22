import React, { useEffect, useState } from 'react'
import styled, { css } from 'styled-components/macro'
import axios from 'axios'

import { compose } from 'redux'
import { withFeedbackHandler, withSocket } from '@hoc'

import { redirectTo, handleApiError } from '@utils'

const GuestContainer = styled.div`
    ${({ blurred }) => {
        if (blurred)
            return css`
                filter: blur(4px);
                transition: filter 0.5s linear;
            `
    }}
`

const Guest = ({ children, shouldFeedbackHandlerAppear, socket, setSocket }) => {
    const [shouldChildrenAppear, setShouldChildrenAppear] = useState(false)
    const confirmToken = async () => {
        const url = '/api/confirmToken'
        try {
            const RESPONSE = await axios.get(url)
            if (RESPONSE) {
                const { role } = RESPONSE.data
                if (role === 'teacher') {
                    redirectTo('/profil-nauczyciela')
                }
                if (role === 'student') {
                    redirectTo('/profil-ucznia')
                }
                setShouldChildrenAppear(true)
            }
        } catch (error) {
            handleApiError(error)
        }
    }
    useEffect(() => {
        confirmToken()
    }, [])
    useEffect(() => {
        if (socket) {
            socket.disconnect()
            setSocket()
        }
    }, [socket])
    return (
        shouldChildrenAppear && (
            <GuestContainer blurred={shouldFeedbackHandlerAppear}>{children}</GuestContainer>
        )
    )
}

export default compose(withFeedbackHandler, withSocket)(Guest)
