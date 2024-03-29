import React from 'react'
import styled from 'styled-components/macro'

import { compose } from 'redux'
import { withFeedbackHandler } from 'hoc'

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
    z-index: 4;
`

const FeedbackHandler = ({
    feedbackHandlerData: { message, buttonText, callback },
    setShouldFeedbackHandlerAppear
}) => {
    const closeFeedbackHandler = () => {
        if (typeof callback === 'function') {
            callback()
        }
        setShouldFeedbackHandlerAppear(false)
    }
    return (
        <FeedbackHandlerContainer>
            <Dashboard.Message>{message}</Dashboard.Message>
            {buttonText && (
                <Dashboard.Button onClick={closeFeedbackHandler}>{buttonText}</Dashboard.Button>
            )}
        </FeedbackHandlerContainer>
    )
}

export default compose(withFeedbackHandler)(FeedbackHandler)
