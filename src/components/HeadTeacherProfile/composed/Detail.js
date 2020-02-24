import React, { useEffect, useRef } from 'react'
import styled from 'styled-components/macro'

import StyledDetail from '../styled/Detail'

const DetailContainer = styled.div`
    margin-bottom: 20px;
    :last-of-type {
        margin-bottom: 0px;
    }
`

const Detail = ({ label, value }) => {
    const detail = useRef()
    useEffect(() => {
        if (detail.current) {
            detail.current.style.height = '16px'
            detail.current.style.height = `${detail.current.scrollHeight}px`
        }
    }, [])
    return (
        <DetailContainer>
            <StyledDetail.Label>{label}</StyledDetail.Label>
            <StyledDetail.Detail ref={detail}>{value}</StyledDetail.Detail>
        </DetailContainer>
    )
}

export default Detail
