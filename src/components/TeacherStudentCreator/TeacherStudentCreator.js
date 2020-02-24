import React, { useEffect, useState } from 'react'
import styled from 'styled-components/macro'
import validator from 'validator'

import { compose } from 'redux'
import { withMenu } from '@hoc'

import APDashboard from '@components/AdminProfile/styled/Dashboard'
import AHTCForm from '@components/AdminHeadTeacherCreator/styled/Form'

import AHTCComposed from '@components/AdminHeadTeacherCreator/composed'
import HTSCComposed from '@components/HeadTeacherSchoolCreator/composed'

import { apiAxios, delayedApiAxios, setFeedbackData, detectSanitization } from '@utils'

const TeacherStudentCreatorContainer = styled(APDashboard.Container)`
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
`

const TeacherStudentCreator = ({ shouldMenuAppear }) => {
    const [isLoading, setIsLoading] = useState(true)
    const [schools, setSchools] = useState([])
    const [email, setEmail] = useState('')
    const [school, setSchool] = useState('')
    const [grade, setGrade] = useState('')
    const [emailError, setEmailError] = useState('')
    const [schoolError, setSchoolError] = useState()
    const [gradeError, setGradeError] = useState('')
    useEffect(() => {
        const getSchoolNames = async () => {
            const url = '/api/teacher/getSchoolNames'
            const response = await delayedApiAxios.get(url)
            if (response) {
                setIsLoading(false)
                const { schools } = response.data
                setSchools(schools)
            }
        }
        getSchoolNames()
    }, [])
    const validate = () => {
        setEmailError('')
        setSchoolError('')
        setGradeError('')
        let isValidated = true
        if (!email || !validator.isEmail(email)) {
            setEmailError('Wprowadź poprawny adres e-mail!')
            isValidated = false
        }
        switch (true) {
            case !school:
                setSchoolError('Zaznacz szkołę!')
                isValidated = false
                break
            case detectSanitization(school):
                setSchoolError('Zaznaczona szkoła zawiera niedozwolone znaki!')
                isValidated = false
                break
            default:
                setSchoolError('')
        }
        switch (true) {
            case !grade:
                setGradeError('Zaznacz klasę!')
                isValidated = false
                break
            case detectSanitization(grade):
                setGradeError('Zaznaczona klasa zawiera niedozwolone znaki!')
                isValidated = false
                break
            default:
                setGradeError('')
        }
        return isValidated
    }
    const handleSubmit = async e => {
        e.preventDefault()
        if (validate()) {
            try {
                const url = '/api/teacher/createStudent'
                const response = await apiAxios.post(url, {
                    email,
                    school,
                    grade
                })
                if (response) {
                    const { successMessage } = response.data
                    setFeedbackData(successMessage, 'Ok')
                }
            } catch (error) {
                if (error.response) {
                    const { status, validationResults } = error.response.data
                    if (status === 422) {
                        setEmailError('')
                        setSchoolError('')
                        setGradeError('')
                        validationResults.forEach(({ parameter, error }) => {
                            if (parameter === 'email') {
                                setEmailError(error)
                            }
                            if (parameter === 'school') {
                                setSchoolError(error)
                            }
                            if (parameter === 'grade') {
                                setGradeError(error)
                            }
                        })
                    }
                }
            }
        }
    }
    return (
        <TeacherStudentCreatorContainer withMenu={shouldMenuAppear} withMorePadding>
            {!isLoading && (
                <>
                    <APDashboard.Header>Utwórz nowego ucznia w szkole</APDashboard.Header>
                    <AHTCForm.Form onSubmit={handleSubmit}>
                        <AHTCComposed.Input
                            id="email"
                            label="E-mail"
                            value={email}
                            placeholder="Wprowadź adres e-mail..."
                            error={emailError}
                            onChange={setEmail}
                            trim
                        />
                        <HTSCComposed.Select
                            id="school"
                            className="school"
                            label="Szkoła"
                            value={school}
                            placeholder="Zaznacz szkołę..."
                            options={schools}
                            error={schoolError}
                            onChange={setSchool}
                        />
                        <HTSCComposed.Select
                            id="grade"
                            className="grade"
                            label="Klasa"
                            value={grade}
                            placeholder="Zaznacz klasę..."
                            options={[
                                '1A',
                                '1B',
                                '1C',
                                '1D',
                                '1E',
                                '1F',
                                '1G',
                                '1H',
                                '1I',
                                '1J',
                                '1K',
                                '1L',
                                '1M',
                                '2A',
                                '2B',
                                '2C',
                                '2D',
                                '2E',
                                '2F',
                                '2G',
                                '2H',
                                '2I',
                                '2J',
                                '2K',
                                '2L',
                                '2M',
                                '3A',
                                '3B',
                                '3C',
                                '3D',
                                '3E',
                                '3F',
                                '3G',
                                '3H',
                                '3I',
                                '3J',
                                '3K',
                                '3L',
                                '3M',
                                '4A',
                                '4B',
                                '4C',
                                '4D',
                                '4E',
                                '4F',
                                '4G',
                                '4H',
                                '4I',
                                '4J',
                                '4K',
                                '4L',
                                '4M'
                            ]}
                            error={gradeError}
                            onChange={setGrade}
                        />
                        <AHTCForm.Submit>Utwórz ucznia</AHTCForm.Submit>
                    </AHTCForm.Form>
                </>
            )}
        </TeacherStudentCreatorContainer>
    )
}

export default compose(withMenu)(TeacherStudentCreator)
