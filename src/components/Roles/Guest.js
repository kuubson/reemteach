import React, { useEffect, useState } from 'react'
import styled, { css } from 'styled-components/macro'
import axios from 'axios'

import { compose } from 'redux'
import { withSocket, withFeedbackHandler, handleApiError } from '@hoc'

import { redirectTo } from '@utils'

const GuestContainer = styled.div`
    ${({ blurred }) => {
        if (blurred)
            return css`
                filter: blur(4px);
                transition: filter 0.5s linear;
            `
    }}
`

const Guest = ({ children, socket, setSocket, shouldFeedbackHandlerAppear }) => {
    const [shouldChildrenAppear, setShouldChildrenAppear] = useState(false)
    useEffect(() => {
        if (socket) {
            socket.disconnect()
            setSocket()
        }
        const confirmToken = async () => {
            try {
                const url = '/api/confirmToken'
                const response = await axios.get(url)
                if (response) {
                    const { role } = response.data
                    if (role === 'admin') {
                        redirectTo('/admin/profil')
                    }
                    if (role === 'headTeacher') {
                        redirectTo('/dyrektor/profil')
                    }
                    if (role === 'teacher') {
                        redirectTo('/nauczyciel/profil')
                    }
                    if (role === 'student') {
                        redirectTo('/uczeń/profil')
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
            <GuestContainer blurred={shouldFeedbackHandlerAppear}>{children}</GuestContainer>
        )
    )
}

export default compose(withSocket, withFeedbackHandler)(Guest)
