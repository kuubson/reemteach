import React, { useEffect, useState } from 'react'
import styled from 'styled-components/macro'
import { hot } from 'react-hot-loader/root'
import { setConfig } from 'react-hot-loader'
import { Switch, Route, Redirect } from 'react-router-dom'
import { TransitionGroup, CSSTransition } from 'react-transition-group'

import { compose } from 'redux'
import { withRouter, withLoader, withFeedbackHandler, withConfirmationPopup } from '@hoc'

import Roles from './Roles'

import FeedbackHandler from './FeedbackHandler/FeedbackHandler'
import ConfirmationPopup from './ConfirmationPopup/ConfirmationPopup'
import Loader from './Loader/Loader'

import Home from './Home/Home'

import AdminProfile from './AdminProfile/AdminProfile'
import AdminHeadTeacherCreator from './AdminHeadTeacherCreator/AdminHeadTeacherCreator'
import AdminHeadTeachersList from './AdminHeadTeachersList/AdminHeadTeachersList'

import HeadTeacherProfile from './HeadTeacherProfile/HeadTeacherProfile'
import HeadTeacherSchoolCreator from './HeadTeacherSchoolCreator/HeadTeacherSchoolCreator'
import HeadTeacherSchoolManager from './HeadTeacherSchoolManager/HeadTeacherSchoolManager'
import HeadTeacherSchoolBellsManager from './HeadTeacherSchoolBellsManager/HeadTeacherSchoolBellsManager'
import HeadTeacherTeacherCreator from './HeadTeacherTeacherCreator/HeadTeacherTeacherCreator'

import TeacherProfile from './TeacherProfile/TeacherProfile'

import StudentProfile from './StudentProfile/StudentProfile'

setConfig({
    reloadHooks: false
})

const AppContainer = styled.main``

const App = ({
    location,
    isLoading,
    shouldFeedbackHandlerAppear,
    shouldConfirmationPopupAppear
}) => {
    const routes = [
        {
            pathname: '/',
            order: 1,
            render: () => (
                <Roles.Guest>
                    <Home />
                </Roles.Guest>
            )
        },
        {
            pathname: '/admin/profil',
            order: 2,
            render: () => (
                <Roles.Admin>
                    <AdminProfile />
                </Roles.Admin>
            )
        },
        {
            pathname: '/admin/tworzenie-dyrektora',
            order: 3,
            render: () => (
                <Roles.Admin>
                    <AdminHeadTeacherCreator />
                </Roles.Admin>
            )
        },
        {
            pathname: '/admin/lista-dyrektorów',
            order: 4,
            render: () => (
                <Roles.Admin>
                    <AdminHeadTeachersList />
                </Roles.Admin>
            )
        },
        {
            pathname: '/dyrektor/profil',
            order: 2,
            render: () => (
                <Roles.HeadTeacher>
                    <HeadTeacherProfile />
                </Roles.HeadTeacher>
            )
        },
        {
            pathname: '/dyrektor/tworzenie-szkoły',
            order: 3,
            render: () => (
                <Roles.HeadTeacher>
                    <HeadTeacherSchoolCreator />
                </Roles.HeadTeacher>
            )
        },
        {
            pathname: '/dyrektor/zarządzanie-szkołą',
            order: 4,
            render: () => (
                <Roles.HeadTeacher>
                    <HeadTeacherSchoolManager />
                </Roles.HeadTeacher>
            )
        },
        {
            pathname: '/dyrektor/zarządzanie-dzwonkami-w-szkole',
            order: 5,
            render: () => (
                <Roles.HeadTeacher>
                    <HeadTeacherSchoolBellsManager />
                </Roles.HeadTeacher>
            )
        },
        {
            pathname: '/dyrektor/tworzenie-nauczyciela',
            order: 6,
            render: () => (
                <Roles.HeadTeacher>
                    <HeadTeacherTeacherCreator />
                </Roles.HeadTeacher>
            )
        },
        {
            pathname: '/nauczyciel/profil',
            order: 2,
            render: () => (
                <Roles.Teacher>
                    <TeacherProfile />
                </Roles.Teacher>
            )
        },
        {
            pathname: '/uczeń/profil',
            order: 2,
            render: () => (
                <Roles.Student>
                    <StudentProfile />
                </Roles.Student>
            )
        },
        {
            pathname: '*',
            order: 1,
            render: () => <Redirect to="/" />
        }
    ]
    const getExactRoute = value => routes.filter(({ pathname }) => pathname === value)[0]
    const getSimilarRoute = value =>
        routes.filter(({ pathname }) => pathname.startsWith(value.substring(0, 6)))[0]
    const currentKey = location.pathname
    const [pageDirection, setPageDirection] = useState()
    const [currentPath, setCurrentPath] = useState(location.pathname)
    const [currentPathOrder, setCurrentPathOrder] = useState(
        getExactRoute(currentKey)
            ? getExactRoute(currentKey).order
            : getSimilarRoute(currentKey)
            ? getSimilarRoute(currentKey).order
            : 30
    )
    useEffect(() => {
        const newPath = location.pathname
        const newPathOrder = getExactRoute(newPath)
            ? getExactRoute(newPath).order
            : getSimilarRoute(newPath)
            ? getSimilarRoute(newPath).order
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
            {shouldConfirmationPopupAppear && <ConfirmationPopup />}
            <TransitionGroup className={pageDirection}>
                <CSSTransition key={currentKey} timeout={800} classNames="route">
                    <div className="route__container">
                        <Switch location={location}>
                            {routes.map(({ pathname, render }) => (
                                <Route
                                    key={pathname}
                                    path={pathname}
                                    exact={true}
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
    ? compose(withRouter, withLoader, withFeedbackHandler, withConfirmationPopup)(hot(App))
    : compose(withRouter, withLoader, withFeedbackHandler, withConfirmationPopup)(App)
