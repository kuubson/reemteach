import React, { useEffect, useRef } from 'react'
import styled from 'styled-components/macro'

import StyledDetail from '../styled/Detail'

const EditableDetailContainer = styled.div`
    margin-bottom: 20px;
    :last-of-type {
        margin-bottom: 0px;
    }
`

const EditableDetail = ({ label, value, error, onChange, onBlur, textarea, trim }) => {
    const textareaRef = useRef()
    useEffect(() => {
        if (!value && textareaRef.current) {
            textareaRef.current.style.height = '16px'
        } else {
            if (textarea && textareaRef.current) {
                textareaRef.current.style.height = '16px'
                textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
            }
        }
    }, [value])
    const handleOnChange = ({ target }) => {
        const value = trim ? target.value.trim() : target.value
        onChange(value)
    }
    return (
        <EditableDetailContainer>
            <StyledDetail.Label>{label}</StyledDetail.Label>
            <StyledDetail.Detail
                ref={textarea && textareaRef}
                value={value}
                onChange={handleOnChange}
                onBlur={onBlur}
                as={textarea ? 'textarea' : 'input'}
            />
            {error && <StyledDetail.Error>{error}</StyledDetail.Error>}
        </EditableDetailContainer>
    )
}

export default EditableDetail
