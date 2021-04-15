import React, { useEffect, useState } from 'react'
import styled from 'styled-components/macro'

import { compose } from 'redux'
import { withMenu } from 'hoc'

import APDashboard from 'components/AdminProfile/styled/Dashboard'
import AHTLDashboard from 'components/AdminHeadTeachersList/styled/Dashboard'

import HTPComposed from 'components/HeadTeacherProfile/composed'

import {
    apiAxios,
    delayedApiAxios,
    setFeedbackData,
    setConfirmationPopupData,
    detectSanitization
} from 'utils'

const HeadTeacherNewsListContainer = styled(APDashboard.Container)`
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
`

const HeadTeacherNewsList = ({ shouldMenuAppear }) => {
    const [isLoading, setIsLoading] = useState(true)
    const [news, setNews] = useState([])
    useEffect(() => {
        const getNews = async () => {
            const url = '/api/headTeacher/getNews'
            const response = await delayedApiAxios.get(url)
            if (response) {
                setIsLoading(false)
                const { news } = response.data
                setNews(news)
            }
        }
        getNews()
    }, [])
    const destroyNews = id => {
        setConfirmationPopupData(
            `Czy napewno chcesz usunąć aktualność o id ${id} ze szkoły?`,
            'Tak',
            'Nie',
            async () => {
                const url = '/api/headTeacher/destroyNews'
                const response = await apiAxios.post(url, {
                    id
                })
                if (response) {
                    const { successMessage } = response.data
                    setFeedbackData(successMessage, 'Ok')
                    setNews(news.filter(news => news.id !== id))
                }
            }
        )
    }
    const updateCertainNews = (id, key, value, errorKey, errorValue, shouldSaveButtonAppear) =>
        setNews(
            news.map(news =>
                news.id === id
                    ? {
                          ...news,
                          [key]: value,
                          [errorKey]: errorValue,
                          shouldSaveButtonAppear
                      }
                    : news
            )
        )
    const validateTeacher = (title, content) =>
        title && !detectSanitization(title) && content && !detectSanitization(content)
    const updateNews = async (id, title, content) => {
        const url = '/api/headTeacher/updateNews'
        const response = await apiAxios.post(url, {
            id,
            title,
            content
        })
        if (response) {
            const { successMessage } = response.data
            setFeedbackData(successMessage, 'Ok')
            updateCertainNews(id)
        }
    }
    return (
        <HeadTeacherNewsListContainer withMenu={shouldMenuAppear}>
            {!isLoading && (
                <AHTLDashboard.DetailsContainer fullContent>
                    {news.length > 0 ? (
                        news.map(
                            ({
                                id,
                                title,
                                content,
                                titleError,
                                contentError,
                                createdAt,
                                shouldSaveButtonAppear
                            }) => {
                                return (
                                    <div key={id}>
                                        <HTPComposed.Detail label="Id" value={id} />
                                        <HTPComposed.EditableDetail
                                            label="Tytuł wiadomości"
                                            value={title}
                                            error={titleError}
                                            onChange={title =>
                                                updateCertainNews(
                                                    id,
                                                    'title',
                                                    title,
                                                    'titleError',
                                                    !title
                                                        ? 'Wprowadź tytuł wiadomości!'
                                                        : detectSanitization(title)
                                                        ? 'Tytuł wiadomości zawiera niedozwolone znaki!'
                                                        : '',
                                                    validateTeacher(title, content)
                                                )
                                            }
                                            fullContent
                                        />

                                        <HTPComposed.EditableDetail
                                            label="Treść wiadomości"
                                            value={content}
                                            error={contentError}
                                            onChange={content =>
                                                updateCertainNews(
                                                    id,
                                                    'content',
                                                    content,
                                                    'contentError',
                                                    !content
                                                        ? 'Wprowadź treść wiadomości!'
                                                        : detectSanitization(content)
                                                        ? 'Treść wiadomości zawiera niedozwolone znaki!'
                                                        : '',
                                                    validateTeacher(title, content)
                                                )
                                            }
                                            textarea
                                            fullContent
                                        />
                                        <HTPComposed.Detail
                                            label="Data utworzenia"
                                            value={new Date(createdAt).toLocaleString()}
                                        />
                                        <AHTLDashboard.ButtonsContainer>
                                            <AHTLDashboard.Button onClick={() => destroyNews(id)}>
                                                Usuń
                                            </AHTLDashboard.Button>
                                            {shouldSaveButtonAppear && (
                                                <AHTLDashboard.Button
                                                    onClick={() => updateNews(id, title, content)}
                                                >
                                                    Zapisz
                                                </AHTLDashboard.Button>
                                            )}
                                        </AHTLDashboard.ButtonsContainer>
                                    </div>
                                )
                            }
                        )
                    ) : (
                        <AHTLDashboard.Warning>
                            W szkole nie ma jeszcze żadnej aktualności!
                        </AHTLDashboard.Warning>
                    )}
                </AHTLDashboard.DetailsContainer>
            )}
        </HeadTeacherNewsListContainer>
    )
}

export default compose(withMenu)(HeadTeacherNewsList)
