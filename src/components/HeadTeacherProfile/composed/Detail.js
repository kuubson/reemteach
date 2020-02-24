import React from 'react'
import styled from 'styled-components/macro'

import StyledDetail from '../styled/Detail'

const DetailContainer = styled.div`
    margin-bottom: 20px;
    :last-of-type {
        margin-bottom: 0px;
    }
`

const Detail = ({ label, value }) => {
    return (
        <DetailContainer>
            <StyledDetail.Label>{label}</StyledDetail.Label>
            <StyledDetail.Detail>{value}</StyledDetail.Detail>
        </DetailContainer>
    )
}

export default Detail
