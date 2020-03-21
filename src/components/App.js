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
import HeadTeacherTeachersList from './HeadTeacherTeachersList/HeadTeacherTeachersList'

import TeacherProfile from './TeacherProfile/TeacherProfile'
import TeacherStudentCreator from './TeacherStudentCreator/TeacherStudentCreator'
import TeacherSchoolsList from './TeacherSchoolsList/TeacherSchoolsList'
import TeacherStudentsList from './TeacherStudentsList/TeacherStudentsList'
import TeacherQuestionCreator from './TeacherQuestionCreator/TeacherQuestionCreator'
import TeacherQuestionsManager from './TeacherQuestionsManager/TeacherQuestionsManager'
import TeacherQuestionsDatabase from './TeacherQuestionsDatabase/TeacherQuestionsDatabase'
import TeacherTestCreator from './TeacherTestCreator/TeacherTestCreator'
import TeacherGradingSystemManager from './TeacherGradingSystemManager/TeacherGradingSystemManager'
import TeacherStudentsChat from './TeacherStudentsChat/TeacherStudentsChat'
import TeacherStudentsMap from './TeacherStudentsMap/TeacherStudentsMap'

import StudentProfile from './StudentProfile/StudentProfile'
import StudentLecturesList from './StudentLecturesList/StudentLecturesList'
import StudentTest from './StudentTest/StudentTest'
import StudentSchoolBellsList from './StudentSchoolBellsList/StudentSchoolBellsList'
import StudentChat from './StudentChat/StudentChat'

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
            pathname: '/dyrektor/lista-nauczycieli',
            order: 7,
            render: () => (
                <Roles.HeadTeacher>
                    <HeadTeacherTeachersList />
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
            pathname: '/nauczyciel/tworzenie-ucznia',
            order: 3,
            render: () => (
                <Roles.Teacher>
                    <TeacherStudentCreator />
                </Roles.Teacher>
            )
        },
        {
            pathname: '/nauczyciel/lista-uczniów',
            order: 4,
            render: () => (
                <Roles.Teacher>
                    <TeacherStudentsList />
                </Roles.Teacher>
            )
        },
        {
            pathname: '/nauczyciel/lista-szkół',
            order: 5,
            render: () => (
                <Roles.Teacher>
                    <TeacherSchoolsList />
                </Roles.Teacher>
            )
        },
        {
            pathname: '/nauczyciel/tworzenie-pytania',
            order: 6,
            render: () => (
                <Roles.Teacher>
                    <TeacherQuestionCreator />
                </Roles.Teacher>
            )
        },
        {
            pathname: '/nauczyciel/zarządzanie-pytaniami',
            order: 7,
            render: () => (
                <Roles.Teacher>
                    <TeacherQuestionsManager />
                </Roles.Teacher>
            )
        },
        {
            pathname: '/nauczyciel/baza-pytań',
            order: 8,
            render: () => (
                <Roles.Teacher>
                    <TeacherQuestionsDatabase />
                </Roles.Teacher>
            )
        },
        {
            pathname: '/nauczyciel/tworzenie-testu',
            order: 9,
            render: () => (
                <Roles.Teacher>
                    <TeacherTestCreator />
                </Roles.Teacher>
            )
        },
        {
            pathname: '/nauczyciel/zarządzanie-systemem-oceniania',
            order: 9,
            render: () => (
                <Roles.Teacher>
                    <TeacherGradingSystemManager />
                </Roles.Teacher>
            )
        },
        {
            pathname: '/nauczyciel/czat',
            order: 9,
            render: () => (
                <Roles.Teacher>
                    <TeacherStudentsChat />
                </Roles.Teacher>
            )
        },
        {
            pathname: '/nauczyciel/mapa-uczniów',
            order: 9,
            render: () => (
                <Roles.Teacher>
                    <TeacherStudentsMap />
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
            pathname: '/uczeń/test',
            order: 3,
            render: () => (
                <Roles.Student>
                    <StudentTest />
                </Roles.Student>
            )
        },
        {
            pathname: '/uczeń/lista-indywidualnych-wykładów',
            order: 3,
            render: () => (
                <Roles.Student>
                    <StudentLecturesList />
                </Roles.Student>
            )
        },
        {
            pathname: '/uczeń/rozkład-dzwonków',
            order: 4,
            render: () => (
                <Roles.Student>
                    <StudentSchoolBellsList />
                </Roles.Student>
            )
        },
        {
            pathname: '/uczeń/czat',
            order: 4,
            render: () => (
                <Roles.Student>
                    <StudentChat />
                </Roles.Student>
            )
        },
        {
            pathname: '*',
            order: 1,
            render: () => <Redirect to="/" />
        }
    ]
    const [pageDirection, setPageDirection] = useState()
    const [currentPath, setCurrentPath] = useState(location.pathname)
    const [exactRoute] = routes.filter(({ pathname }) => pathname === location.pathname)
    const [similarRoute] = routes.filter(({ pathname }) =>
        pathname.startsWith(location.pathname.substring(0, 6))
    )
    const [currentPathOrder, setCurrentPathOrder] = useState(
        exactRoute ? exactRoute.order : similarRoute ? similarRoute.order : 30
    )
    useEffect(() => {
        const newPath = location.pathname
        const newPathOrder = exactRoute ? exactRoute.order : similarRoute ? similarRoute.order : 30
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
                <CSSTransition key={location.pathname} classNames="route" timeout={800}>
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
