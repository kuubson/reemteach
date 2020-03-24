import React, { useEffect, useState, useRef } from 'react'
import styled, { css } from 'styled-components/macro'
import L from 'leaflet'
import { Map, TileLayer, Popup } from 'react-leaflet'

import { compose } from 'redux'
import { withSocket, withMenu } from '@hoc'

import APDashboard from '@components/AdminProfile/styled/Dashboard'
import AHTLDashboard from '@components/AdminHeadTeachersList/styled/Dashboard'
import AHTCForm from '@components/AdminHeadTeacherCreator/styled/Form'
import HForm from '@components/Home/styled/Form'
import StyledMenu from '@components/AdminProfile/styled/Menu'
import TSCDashboard from '@components/TeacherStudentsChat/styled/Dashboard'
import Dashboard from './styled/Dashboard'

import HTSCComposed from '@components/HeadTeacherSchoolCreator/composed'

import { delayedApiAxios, setFeedbackData } from '@utils'

const TeacherStudentsChatContainer = styled(APDashboard.Container)`
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    ${({ withMap }) => {
        if (withMap)
            return css`
                padding: 0px !important;
            `
    }}
`

const TeacherStudentsChat = ({ shouldMenuAppear, setShouldMenuAppear }) => {
    const map = useRef()
    const [isLoading, setIsLoading] = useState(true)
    const [shouldMapMenuAppear, setShouldMapMenuAppear] = useState(false)
    const [schools, setSchools] = useState([])
    const [school, setSchool] = useState('')
    const [grade, setGrade] = useState('')
    const [students, setStudents] = useState([])
    const [geolocation, setGeolocation] = useState('')
    useEffect(() => {
        const getGrades = async () => {
            const url = '/api/teacher/getGrades'
            const response = await delayedApiAxios.get(url)
            if (response) {
                setIsLoading(false)
                const { schools } = response.data
                setSchools(schools)
            }
        }
        getGrades()
    }, [])
    useEffect(() => {
        if (map.current) {
            setTimeout(() => {
                map.current.leafletElement.invalidateSize()
            }, 700)
        }
    }, [shouldMenuAppear, shouldMapMenuAppear])
    useEffect(() => {
        if (map.current) {
            const geolocations = students
                .map(({ geolocation }) => geolocation)
                .filter(geolocation => geolocation)
            const markers = geolocations.map(geolocation => new L.Marker(geolocation.split(',')))
            if (markers.length > 0) {
                const markersGroup = new L.featureGroup(markers)
                map.current.leafletElement.fitBounds(markersGroup.getBounds(), {
                    padding: [120, 120]
                })
            }
        }
    }, [students])
    const getGeolocation = async () => {
        const handleGeolocation = () =>
            navigator.geolocation.getCurrentPosition(
                async ({ coords: { latitude, longitude } }) => {
                    setShouldMapMenuAppear(false)
                    const geolocation = [latitude, longitude]
                    setGeolocation(geolocation)
                    map.current.leafletElement.flyTo(geolocation, 13, {
                        duration: 1.2
                    })
                },
                () => {
                    setIsLoading(false)
                    setFeedbackData(
                        'Wystąpił niespodziewany problem przy udostępnianiu lokalizacji!',
                        'Odśwież aplikację',
                        () => window.location.reload()
                    )
                }
            )
        try {
            const { permissions, geolocation } = navigator
            if (!permissions || !geolocation) {
                return setFeedbackData(
                    'Twoja przeglądarka nie wspiera geolokalizacji! Do poprawnego działania aplikacji jest ona wymagana!'
                )
            }
            const { state } = await permissions.query({ name: 'geolocation' })
            switch (state) {
                case 'granted':
                    handleGeolocation()
                    break
                case 'prompt':
                    setFeedbackData(
                        'Aplikacja wymaga zgody na dostęp do lokalizacji!',
                        'Udostępnij',
                        () => handleGeolocation()
                    )
                    break
                default:
                    setFeedbackData(
                        'Aplikacja wymaga zgody na dostęp do lokalizacji! Udostępnij ją w ustawieniach przeglądarki!'
                    )
            }
        } catch (error) {
            setFeedbackData(
                'Wystąpił niespodziewany problem przy udostępnianiu lokalizacji!',
                'Odśwież aplikację',
                () => window.location.reload()
            )
        }
    }
    return (
        <TeacherStudentsChatContainer withMenu={shouldMenuAppear} withMap={grade}>
            {!isLoading &&
                (schools.length > 0 ? (
                    grade ? (
                        <>
                            <StyledMenu.Button
                                onClick={() => {
                                    setShouldMapMenuAppear(true)
                                    setShouldMenuAppear(false)
                                }}
                                visible={!shouldMapMenuAppear}
                                right
                            >
                                Menu mapy
                            </StyledMenu.Button>
                            <TSCDashboard.ParticipantsList visible={shouldMapMenuAppear}>
                                <HForm.CloseButton
                                    onClick={() => {
                                        setShouldMapMenuAppear(false)
                                    }}
                                    left
                                />
                                <StyledMenu.OptionsContainer>
                                    {students.filter(({ geolocation }) => geolocation).length <=
                                        0 && (
                                        <TSCDashboard.ParticipantContainer>
                                            <TSCDashboard.Participant>
                                                W klasie {grade} w szkole {school} nie ma jeszcze
                                                żadnego ucznia ze zaktualizowaną lokalizacją!
                                            </TSCDashboard.Participant>
                                        </TSCDashboard.ParticipantContainer>
                                    )}
                                    <StyledMenu.Option onClick={getGeolocation}>
                                        Twoja lokalizacja
                                    </StyledMenu.Option>
                                    <StyledMenu.Option
                                        onClick={() => {
                                            setSchool('')
                                            setGrade('')
                                            setShouldMapMenuAppear(false)
                                        }}
                                    >
                                        Wróć do wyboru szkoły
                                    </StyledMenu.Option>
                                    <StyledMenu.Option
                                        onClick={() => {
                                            setGrade('')
                                            setShouldMapMenuAppear(false)
                                        }}
                                    >
                                        Wróć do wyboru klasy
                                    </StyledMenu.Option>
                                </StyledMenu.OptionsContainer>
                            </TSCDashboard.ParticipantsList>
                            <Map
                                center={[50, 19]}
                                zoom={13}
                                maxZoom={19}
                                zoomControl={false}
                                ref={map}
                            >
                                <TileLayer
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                />
                                {students.map(
                                    ({ id, name, surname, nick, geolocation, updatedAt }) =>
                                        geolocation && (
                                            <div key={id}>
                                                <Popup
                                                    position={geolocation.split(',')}
                                                    className="popup"
                                                    autoClose={false}
                                                    closeOnClick={false}
                                                    autoPan={false}
                                                >
                                                    <Dashboard.PopupDetail>
                                                        {`${name} ${surname}
                                                        ( ${nick} )
                                                        
                                                        ${new Date(updatedAt).toLocaleString()}`}
                                                    </Dashboard.PopupDetail>
                                                </Popup>
                                            </div>
                                        )
                                )}
                                {geolocation && (
                                    <>
                                        <Popup
                                            position={geolocation}
                                            className="popup"
                                            autoClose={false}
                                            closeOnClick={false}
                                            autoPan={false}
                                        >
                                            <Dashboard.PopupDetail>Ty</Dashboard.PopupDetail>
                                        </Popup>
                                    </>
                                )}
                            </Map>
                        </>
                    ) : (
                        <>
                            <APDashboard.Header>
                                Zaznacz {school ? 'klasę' : 'szkołę'}
                            </APDashboard.Header>
                            <AHTCForm.Form>
                                <HTSCComposed.Select
                                    id={school ? 'grade' : 'school'}
                                    label={school ? 'Klasa' : 'Szkoła'}
                                    value={grade}
                                    placeholder={`Zaznacz ${school ? 'klasę' : 'szkołę'}...`}
                                    options={
                                        school
                                            ? schools
                                                  .find(({ name }) => name === school)
                                                  .grades.map(({ grade }) => grade)
                                            : schools.map(({ name }) => name)
                                    }
                                    onChange={
                                        school
                                            ? grade => {
                                                  setGrade(grade)
                                                  const foundSchool = schools.find(
                                                      ({ name }) => name === school
                                                  )
                                                  const { students } = foundSchool.grades.find(
                                                      schoolGrade => schoolGrade.grade === grade
                                                  )
                                                  const filteredStudents = students.filter(
                                                      ({ isActivated }) => isActivated
                                                  )
                                                  setShouldMapMenuAppear(
                                                      students.filter(
                                                          ({ geolocation }) => geolocation
                                                      ).length <= 0
                                                  )
                                                  setStudents(filteredStudents)
                                              }
                                            : setSchool
                                    }
                                />
                            </AHTCForm.Form>
                        </>
                    )
                ) : (
                    <AHTLDashboard.Warning>
                        Nie należysz jeszcze do żadnej szkoły w której są utworzone klasy!
                    </AHTLDashboard.Warning>
                ))}
        </TeacherStudentsChatContainer>
    )
}

export default compose(withSocket, withMenu)(TeacherStudentsChat)
