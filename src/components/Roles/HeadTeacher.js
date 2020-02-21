import React, { useEffect, useState } from 'react'
import styled, { css } from 'styled-components/macro'

import { compose } from 'redux'
import { withRouter, withFeedbackHandler } from '@hoc'

import { delayedApiAxios, delayedRedirectTo } from '@utils'

const HeadTeacherContainer = styled.div`
    ${({ blurred }) => {
        if (blurred)
            return css`
                filter: blur(4px);
                transition: filter 0.5s linear;
            `
    }}
`

const HeadTeacher = ({ children, shouldFeedbackHandlerAppear }) => {
    const [shouldChildrenAppear, setShouldChildrenAppear] = useState(false)
    useEffect(() => {
        const confirmToken = async () => {
            const url = '/api/confirmToken'
            const response = await delayedApiAxios.get(url)
            if (response) {
                const profilePathname = '/dyrektor/profil'
                const { role, isActivated } = response.data
                if (role === 'guest' || role !== 'headTeacher') {
                    delayedRedirectTo('/')
                }
                if (!isActivated && location.pathname !== profilePathname) {
                    setTimeout(() => {
                        delayedRedirectTo(profilePathname)
                    }, 800)
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
                {children}
            </HeadTeacherContainer>
        )
    )
}

export default compose(withRouter, withFeedbackHandler)(HeadTeacher)
