import React from 'react'
import styled from 'styled-components/macro'

import StyledDetail from '../styled/Detail'

const EditableDetailContainer = styled.div`
    margin-bottom: 20px;
    :last-of-type {
        margin-bottom: 0px;
    }
`

const EditableDetail = ({ label, value, error, onChange, onBlur }) => {
    return (
        <EditableDetailContainer>
            <StyledDetail.Label>{label}</StyledDetail.Label>
            <StyledDetail.EditableDetail
                value={value}
                onChange={e => onChange(e.target.value)}
                onBlur={onBlur}
            />
            {error && <StyledDetail.Error>{error}</StyledDetail.Error>}
        </EditableDetailContainer>
    )
}

export default EditableDetail
