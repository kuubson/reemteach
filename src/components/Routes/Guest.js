import React, { useEffect, useState } from 'react'
import styled, { css } from 'styled-components/macro'

import { compose } from 'redux'
import { withFeedbackHandler, withSocket } from '@hoc'

import { delayedApiAxios, redirectTo } from '@utils'

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
    useEffect(() => {
        const confirmToken = async () => {
            const url = '/api/confirmToken'
            const RESPONSE = await delayedApiAxios.get(url)
            if (RESPONSE) {
                const { role } = RESPONSE.data
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
        }
        confirmToken()
        setTimeout(() => {
            setShouldChildrenAppear(true)
        }, 0)
    }, [])
    // useEffect(() => {
    //     if (socket) {
    //         socket.disconnect()
    //         setSocket()
    //     }
    // }, [socket])
    return (
        shouldChildrenAppear && (
            <GuestContainer blurred={shouldFeedbackHandlerAppear}>{children}</GuestContainer>
        )
    )
}

export default compose(withFeedbackHandler, withSocket)(Guest)
