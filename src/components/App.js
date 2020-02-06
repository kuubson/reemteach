import React from 'react'
import styled from 'styled-components/macro'
import { hot } from 'react-hot-loader/root'
import { setConfig } from 'react-hot-loader'
import { Switch, Route, Redirect } from 'react-router-dom'

import { compose } from 'redux'
import { withLoader, withFeedbackHandler } from '@hoc'

import Guest from './Routes/Guest'
import User from './Routes/User'

import FeedbackHandler from './FeedbackHandler/FeedbackHandler'
import Loader from './Loader/Loader'

import Home from './Home/Home'

import AdminProfile from './AdminProfile/AdminProfile'

import HeadTeacherProfile from './HeadTeacherProfile/HeadTeacherProfile'

import TeacherProfile from './TeacherProfile/TeacherProfile'

import StudentProfile from './StudentProfile/StudentProfile'

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
            path: '/admin/profil',
            render: () => (
                <User role="admin">
                    <AdminProfile />
                </User>
            )
        },
        {
            path: '/headTeacher/profil',
            render: () => (
                <User role="headTeacher">
                    <HeadTeacherProfile />
                </User>
            )
        },
        {
            path: '/teacher/profil',
            render: () => (
                <User role="teacher">
                    <TeacherProfile />
                </User>
            )
        },
        {
            path: '/student/profil',
            render: () => (
                <User role="student">
                    <StudentProfile />
                </User>
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
                    <Route key={path} exact={shouldBeExactPath} path={path} render={render} />
                ))}
            </Switch>
        </AppContainer>
    )
}

export default process.env.NODE_ENV === 'development'
    ? compose(withLoader, withFeedbackHandler)(hot(App))
    : compose(withLoader, withFeedbackHandler)(App)
