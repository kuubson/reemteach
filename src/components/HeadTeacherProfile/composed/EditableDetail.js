import React, { useEffect, useState, useRef } from 'react'
import styled from 'styled-components/macro'

import HTSCComposed from '@components/HeadTeacherSchoolCreator/composed'
import StyledDetail from '../styled/Detail'

const EditableDetailContainer = styled.div`
    margin: 0px 25% 20px 25%;
    :last-of-type {
        margin: 0px 25% 0px 25%;
    }
    @media (max-width: 800px) {
        margin: 0px 10% 20px 10%;
        :last-of-type {
            margin: 0px 10% 0px 10%;
        }
    }
`

const EditableDetail = ({
    id,
    label,
    value,
    placeholder,
    options,
    error,
    onChange,
    onBlur,
    textarea,
    select,
    trim,
    fullContent
}) => {
    const textareaRef = useRef()
    const [shouldSelectAppear, setShouldSelectAppear] = useState(false)
    useEffect(() => {
        if (textarea && textareaRef.current) {
            if (!value) {
                textareaRef.current.style.minHeight = '16px'
            } else {
                textareaRef.current.style.minHeight = `${textareaRef.current.scrollHeight}px`
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
                onClick={() => setShouldSelectAppear(true)}
                onChange={handleOnChange}
                onBlur={onBlur}
                as={textarea ? 'textarea' : 'input'}
                readOnly={select}
                rows="1"
                fullContent={fullContent}
            />
            {select && shouldSelectAppear && (
                <HTSCComposed.Select
                    id={id}
                    value={value}
                    placeholder={placeholder}
                    options={options}
                    onChange={value => {
                        onChange(value)
                        setShouldSelectAppear(false)
                    }}
                    withoutPadding
                />
            )}
            {error && <StyledDetail.Error>{error}</StyledDetail.Error>}
        </EditableDetailContainer>
    )
}

export default EditableDetail
