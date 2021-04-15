import React, { useEffect, useState } from 'react'
import styled from 'styled-components/macro'

import { compose } from 'redux'
import { withMenu } from 'hoc'

import APDashboard from 'components/AdminProfile/styled/Dashboard'
import AHTLDashboard from 'components/AdminHeadTeachersList/styled/Dashboard'

import HTPComposed from 'components/HeadTeacherProfile/composed'

import { delayedApiAxios } from 'utils'

const StudentNewsListContainer = styled(APDashboard.Container)`
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
`

const StudentNewsList = ({ shouldMenuAppear }) => {
    const [isLoading, setIsLoading] = useState(true)
    const [news, setResults] = useState([])
    useEffect(() => {
        const getNews = async () => {
            const url = '/api/student/getNews'
            const response = await delayedApiAxios.get(url)
            if (response) {
                setIsLoading(false)
                const { news } = response.data
                setResults(news)
            }
        }
        getNews()
    }, [])
    return (
        <StudentNewsListContainer withMenu={shouldMenuAppear}>
            {!isLoading && (
                <AHTLDashboard.DetailsContainer fullContent>
                    {news.length > 0 ? (
                        news.map(({ id, title, content, createdAt }) => {
                            return (
                                <div key={id}>
                                    <HTPComposed.Detail label="Tytuł wiadomości" value={title} />
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
        </StudentNewsListContainer>
    )
}

export default compose(withMenu)(StudentNewsList)
