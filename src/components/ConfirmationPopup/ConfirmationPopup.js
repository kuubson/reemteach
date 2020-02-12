import React from 'react'
import styled from 'styled-components/macro'

import { compose } from 'redux'
import { withConfirmationPopup } from '@hoc'

import Dashboard from './styled/Dashboard'

const ConfirmationPopupContainer = styled.div`
    width: 100%;
    height: 100vh;
    background: rgba(0, 0, 0, 0.8);
    position: fixed;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    top: 0px;
    left: 0px;
    z-index: 1;
`

const ConfirmationPopup = ({
    confirmationPopupData: { message, confirmationButtonText, rejectionButtonText, callback },
    setShouldConfirmationPopupAppear
}) => {
    return (
        <ConfirmationPopupContainer>
            <Dashboard.Text>{message}</Dashboard.Text>
            <Dashboard.ButtonsContainer>
                <Dashboard.Button
                    onClick={() => {
                        if (typeof callback === 'function') {
                            callback()
                        }
                        setShouldConfirmationPopupAppear(false)
                    }}
                >
                    {confirmationButtonText}
                </Dashboard.Button>
                <Dashboard.Button onClick={() => setShouldConfirmationPopupAppear(false)}>
                    {rejectionButtonText}
                </Dashboard.Button>
            </Dashboard.ButtonsContainer>
        </ConfirmationPopupContainer>
    )
}

export default compose(withConfirmationPopup)(ConfirmationPopup)
