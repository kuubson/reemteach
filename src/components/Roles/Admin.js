import React, { useEffect, useState } from 'react'
import styled, { css } from 'styled-components/macro'

import { compose } from 'redux'
import { withRouter, withFeedbackHandler } from '@hoc'

import { delayedApiAxios, delayedRedirectTo } from '@utils'

const AdminContainer = styled.div`
    ${({ blurred }) => {
        if (blurred)
            return css`
                filter: blur(4px);
                transition: filter 0.5s linear;
            `
    }}
`

const Admin = ({ children, shouldFeedbackHandlerAppear }) => {
    const [shouldChildrenAppear, setShouldChildrenAppear] = useState(false)
    useEffect(() => {
        const confirmToken = async () => {
            const url = '/api/confirmToken'
            const response = await delayedApiAxios.get(url)
            if (response) {
                const { role } = response.data
                if (role === 'guest' || role !== 'admin') {
                    delayedRedirectTo('/')
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
            <AdminContainer blurred={shouldFeedbackHandlerAppear}>{children}</AdminContainer>
        )
    )
}

export default compose(withRouter, withFeedbackHandler)(Admin)
