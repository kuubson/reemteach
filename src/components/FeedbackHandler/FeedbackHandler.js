import React from 'react'
import styled from 'styled-components/macro'

import { compose } from 'redux'
import { withFeedbackHandler } from '@hoc'

import Dashboard from './styled/Dashboard'

const FeedbackHandlerContainer = styled.div`
    width: 100%;
    height: 100vh;
    background: rgba(0, 0, 0, 0.8);
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    position: fixed;
    top: 0px;
    left: 0px;
    z-index: 3;
`

const FeedbackHandler = ({
    setShouldFeedbackHandlerAppear,
    feedbackHandlerData: { message, buttonText, callback }
}) => {
    const closeFeedbackHandler = () => {
        if (typeof callback === 'function') {
            callback()
        }
        setShouldFeedbackHandlerAppear(false)
    }
    return (
        <FeedbackHandlerContainer>
            <Dashboard.Text>{message}</Dashboard.Text>
            <Dashboard.Button onClick={closeFeedbackHandler}>{buttonText}</Dashboard.Button>
        </FeedbackHandlerContainer>
    )
}

export default compose(withFeedbackHandler)(FeedbackHandler)
