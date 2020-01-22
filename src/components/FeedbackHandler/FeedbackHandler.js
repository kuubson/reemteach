import React from 'react'
import styled from 'styled-components/macro'

import { compose } from 'redux'
import { withFeedbackHandler } from '@hoc'

import Dashboard from './styled/Dashboard'

import { closeFeedbackHandler } from './utils'

const FeedbackHandlerContainer = styled.div`
    width: 100%;
    height: 100vh;
    background: rgba(0, 0, 0, 0.8);
    color: white;
    position: fixed;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    top: 0px;
    left: 0px;
    z-index: 5;
`

const FeedbackHandler = ({ feedbackHandlerData: { message, buttonText, callback } }) => {
    return (
        <FeedbackHandlerContainer>
            {message && <Dashboard.Text>{message}</Dashboard.Text>}
            {buttonText && (
                <Dashboard.Button onClick={() => closeFeedbackHandler({ callback })}>
                    {buttonText}
                </Dashboard.Button>
            )}
        </FeedbackHandlerContainer>
    )
}

export default compose(withFeedbackHandler)(FeedbackHandler)
