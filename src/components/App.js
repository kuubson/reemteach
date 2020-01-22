import React from 'react'
import styled from 'styled-components/macro'
import { hot } from 'react-hot-loader/root'
import { setConfig } from 'react-hot-loader'
import { Switch, Route, Redirect } from 'react-router-dom'

import { compose } from 'redux'
import { withLoader, withFeedbackHandler } from '@hoc'

import Guest from '@components/Routes/Guest'
import User from '@components/Routes/User'

import FeedbackHandler from '@components/FeedbackHandler/FeedbackHandler'
import Loader from '@components/Loader/Loader'

import Home from '@components/Home/Home'

setConfig({
    reloadHooks: false
})

const AppContainer = styled.main``

const App = ({ isLoading, shouldFeedbackHandlerAppear }) => {
    const routes = [
        {
            path: '/',
            shouldBeExactPath: true,
            render: () => (
                <Guest>
                    <Home />
                </Guest>
            )
        },
        {
            path: '*',
            render: () => <Redirect to="/" />
        }
    ]
    return (
        <AppContainer>
            {isLoading && <Loader />}
            {shouldFeedbackHandlerAppear && <FeedbackHandler />}
            <Switch>
                {routes.map(({ path, shouldBeExactPath, render }) => (
                    <Route
                        key={path}
                        exact={shouldBeExactPath ? true : false}
                        path={path}
                        render={render}
                    />
                ))}
            </Switch>
        </AppContainer>
    )
}

export default process.env.NODE_ENV === 'development'
    ? compose(withLoader, withFeedbackHandler)(hot(App))
    : compose(withLoader, withFeedbackHandler)(App)
