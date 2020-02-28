import React from 'react'
import styled from 'styled-components/macro'

import StyledDetail from '../styled/Detail'

const DetailContainer = styled.div`
    margin-bottom: 20px;
    cursor: ${({ withPointer }) => (withPointer ? 'pointer' : 'initial')};
    :last-of-type {
        margin-bottom: 0px;
    }
`

const Detail = ({ label, value, onClick, withPointer }) => {
    return (
        <DetailContainer withPointer={withPointer}>
            <StyledDetail.Label>{label}</StyledDetail.Label>
            <StyledDetail.Detail onClick={onClick}>{value}</StyledDetail.Detail>
        </DetailContainer>
    )
}

export default Detail
