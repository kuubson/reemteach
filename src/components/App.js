import React, { useEffect, useState } from 'react'
import styled from 'styled-components/macro'
import { hot } from 'react-hot-loader/root'
import { setConfig } from 'react-hot-loader'
import { Switch, Route, Redirect } from 'react-router-dom'
import { TransitionGroup, CSSTransition } from 'react-transition-group'

import { compose } from 'redux'
import { withRouter, withLoader, withFeedbackHandler } from '@hoc'

import Guest from './Routes/Guest'
import User from './Routes/User'

import FeedbackHandler from './FeedbackHandler/FeedbackHandler'
import Loader from './Loader/Loader'

import Home from './Home/Home'

import AdminProfile from './AdminProfile/AdminProfile'
import AdminHeadTeacherCreator from './AdminHeadTeacherCreator/AdminHeadTeacherCreator'
import AdminHeadTeachersList from './AdminHeadTeachersList/AdminHeadTeachersList'

import HeadTeacherProfile from './HeadTeacherProfile/HeadTeacherProfile'

import TeacherProfile from './TeacherProfile/TeacherProfile'

import StudentProfile from './StudentProfile/StudentProfile'

setConfig({
    reloadHooks: false
})

const AppContainer = styled.main``

const App = ({ location, isLoading, shouldFeedbackHandlerAppear }) => {
    const routes = [
        {
            path: '/',
            order: 1,
            shouldBeExactPath: true,
            render: () => (
                <Guest>
                    <Home />
                </Guest>
            )
        },
        {
            path: '/admin/profil',
            order: 2,
            render: () => (
                <User role="admin">
                    <AdminProfile />
                </User>
            )
        },
        {
            path: '/admin/dodawanie-dyrektora',
            order: 3,
            render: () => (
                <User role="admin">
                    <AdminHeadTeacherCreator />
                </User>
            )
        },
        {
            path: '/admin/lista-dyrektorów',
            order: 4,
            render: () => (
                <User role="admin">
                    <AdminHeadTeachersList />
                </User>
            )
        },
        {
            path: '/dyrektor/profil',
            order: 2,
            render: () => (
                <User role="headTeacher">
                    <HeadTeacherProfile />
                </User>
            )
        },
        {
            path: '/nauczyciel/profil',
            order: 2,
            render: () => (
                <User role="teacher">
                    <TeacherProfile />
                </User>
            )
        },
        {
            path: '/uczeń/profil',
            order: 2,
            render: () => (
                <User role="student">
                    <StudentProfile />
                </User>
            )
        },
        {
            path: '*',
            order: 1,
            render: () => <Redirect to="/" />
        }
    ]
    const existingExactRoute = routes.filter(({ path }) => path === location.pathname)[0]
    const existingSimilarRoute = routes.filter(({ path }) =>
        path.startsWith(location.pathname.substring(0, 6))
    )[0]
    const currentKey = location.pathname
    const [pageDirection, setPageDirection] = useState()
    const [currentPath, setCurrentPath] = useState(location.pathname)
    const [currentPathOrder, setCurrentPathOrder] = useState(
        existingExactRoute
            ? existingExactRoute.order
            : existingSimilarRoute
            ? existingSimilarRoute.order
            : 30
    )
    useEffect(() => {
        const newPath = location.pathname
        const existingExactRoute = routes.filter(({ path }) => path === newPath)[0]
        const existingSimilarRoute = routes.filter(({ path }) =>
            path.startsWith(newPath.substring(0, 6))
        )[0]
        const newPathOrder = existingExactRoute
            ? existingExactRoute.order
            : existingSimilarRoute
            ? existingSimilarRoute.order
            : 30
        if (newPath !== currentPath) {
            const direction = currentPathOrder < newPathOrder ? 'left' : 'right'
            setCurrentPath(newPath)
            setCurrentPathOrder(newPathOrder)
            setPageDirection(direction)
        }
    })
    return (
        <AppContainer>
            {isLoading && <Loader />}
            {shouldFeedbackHandlerAppear && <FeedbackHandler />}
            <TransitionGroup className={pageDirection}>
                <CSSTransition key={currentKey} timeout={800} classNames="route">
                    <div className="route__container">
                        <Switch location={location}>
                            {routes.map(({ path, shouldBeExactPath, render }) => (
                                <Route
                                    key={path}
                                    exact={shouldBeExactPath}
                                    path={path}
                                    render={render}
                                />
                            ))}
                        </Switch>
                    </div>
                </CSSTransition>
            </TransitionGroup>
        </AppContainer>
    )
}

export default process.env.NODE_ENV === 'development'
    ? compose(withRouter, withLoader, withFeedbackHandler)(hot(App))
    : compose(withRouter, withLoader, withFeedbackHandler)(App)
