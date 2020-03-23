import React, { useEffect, useState } from 'react'
import styled from 'styled-components/macro'

import { compose } from 'redux'
import { withMenu } from '@hoc'

import APDashboard from '@components/AdminProfile/styled/Dashboard'
import AHTLDashboard from '@components/AdminHeadTeachersList/styled/Dashboard'
import AHTCForm from '@components/AdminHeadTeacherCreator/styled/Form'
import HForm from '@components/Home/styled/Form'
import HTSBMDashboard from '@components/HeadTeacherSchoolBellsManager/styled/Dashboard'

import HTPComposed from '@components/HeadTeacherProfile/composed'
import AHTCComposed from '@components/AdminHeadTeacherCreator/composed'

import { delayedApiAxios } from '@utils'

const TeacherSchoolsListContainer = styled(APDashboard.Container)`
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
`

const TeacherSchoolsList = ({ shouldMenuAppear }) => {
    const [isLoading, setIsLoading] = useState(true)
    const [schools, setSchools] = useState([])
    const [schoolBells, setSchoolBells] = useState([])
    const [news, setNews] = useState([])
    useEffect(() => {
        const getSchools = async () => {
            const url = '/api/teacher/getSchools'
            const response = await delayedApiAxios.get(url)
            if (response) {
                setIsLoading(false)
                const { schools } = response.data
                setSchools(schools)
            }
        }
        getSchools()
    }, [])
    return (
        <TeacherSchoolsListContainer withMenu={shouldMenuAppear}>
            {!isLoading &&
                (schoolBells.length > 0 || news.length > 0 ? (
                    <>
                        {schoolBells.length > 0 && news.length <= 0 && (
                            <AHTCForm.Form withLessMargin>
                                <HForm.CloseButton onClick={() => setSchoolBells([])} black />
                                {schoolBells.map(({ id, from, to, isRecess }) => (
                                    <HTSBMDashboard.InputsOuterContainer key={id}>
                                        <HTSBMDashboard.InputsContainer withoutError>
                                            <AHTCComposed.Input
                                                label={`${isRecess ? 'Przerwa' : 'Lekcja'} od`}
                                                value={from}
                                                placeholder="Wprowadź godzinę..."
                                                double
                                                readOnly
                                            />
                                            <AHTCComposed.Input
                                                label="Do"
                                                value={to}
                                                placeholder="Wprowadź godzinę..."
                                                readOnly
                                            />
                                        </HTSBMDashboard.InputsContainer>
                                    </HTSBMDashboard.InputsOuterContainer>
                                ))}
                            </AHTCForm.Form>
                        )}
                        {news.length > 0 && schoolBells.length <= 0 && (
                            <AHTLDashboard.DetailsContainer fullContent>
                                <HForm.CloseButton onClick={() => setNews([])} black />
                                {news.length > 0 ? (
                                    news.map(({ id, title, content, createdAt }) => {
                                        return (
                                            <div key={id}>
                                                <HTPComposed.Detail
                                                    label="Tytuł wiadomości"
                                                    value={title}
                                                />
                                                <HTPComposed.Detail
                                                    label="Treść wiadomości"
                                                    value={content}
                                                    fullContent
                                                />
                                                <HTPComposed.Detail
                                                    label="Data utworzenia"
                                                    value={new Date(createdAt).toLocaleString()}
                                                />
                                            </div>
                                        )
                                    })
                                ) : (
                                    <AHTLDashboard.Warning>
                                        W szkole nie ma jeszcze żadnej aktualności!
                                    </AHTLDashboard.Warning>
                                )}
                            </AHTLDashboard.DetailsContainer>
                        )}
                    </>
                ) : (
                    <AHTLDashboard.DetailsContainer>
                        {schools.length > 0 ? (
                            schools.map(
                                ({
                                    id,
                                    name: schoolName,
                                    type,
                                    description,
                                    address,
                                    creationYear,
                                    schoolBells,
                                    news,
                                    headTeacher: { email, name, surname }
                                }) => {
                                    return (
                                        <div key={id}>
                                            <HTPComposed.Detail
                                                label="Nazwa szkoły"
                                                value={schoolName}
                                            />
                                            <HTPComposed.Detail
                                                label="Dyrektor"
                                                value={`${name} ${surname}`}
                                            />
                                            <HTPComposed.Detail label="E-mail" value={email} />
                                            <HTPComposed.Detail
                                                label="Rodzaj szkoły"
                                                value={type}
                                            />
                                            <HTPComposed.Detail
                                                label="Opis szkoły"
                                                value={description}
                                                fullContent
                                            />
                                            <HTPComposed.Detail
                                                label="Adres szkoły"
                                                value={address}
                                            />
                                            <HTPComposed.Detail
                                                label="Rok utworzenia szkoły"
                                                value={creationYear}
                                            />
                                            {news.length > 0 && (
                                                <AHTCForm.Submit
                                                    onClick={() => setNews(news)}
                                                    withLessMargin
                                                >
                                                    Pokaż aktualności
                                                </AHTCForm.Submit>
                                            )}
                                            <AHTCForm.Submit
                                                onClick={() => setSchoolBells(schoolBells)}
                                                withLessMargin
                                            >
                                                Pokaż rozkład dzwonków
                                            </AHTCForm.Submit>
                                        </div>
                                    )
                                }
                            )
                        ) : (
                            <AHTLDashboard.Warning>
                                Nie należysz jeszcze do żadnej szkoły!
                            </AHTLDashboard.Warning>
                        )}
                    </AHTLDashboard.DetailsContainer>
                ))}
        </TeacherSchoolsListContainer>
    )
}

export default compose(withMenu)(TeacherSchoolsList)
