import React, { useEffect, useState, useRef } from 'react'
import styled from 'styled-components/macro'

import AHTCForm from '@components/AdminHeadTeacherCreator/styled/Form'
import StyledSelect from '../styled/Select'

const SelectContainer = styled.div`
    margin-bottom: 25px;
    :last-of-type {
        margin-bottom: 0px;
    }
`

const Select = ({ id, className, label, value, placeholder, options, error, onChange }) => {
    const selectOptionsRef = useRef()
    const [shouldOptionsExpand, setShouldOptionsExpand] = useState(false)
    useEffect(() => {
        if (shouldOptionsExpand && selectOptionsRef.current) {
            const optionsAmount = document.querySelectorAll(`.${className}`).length
            const optionHeight = document.querySelector(`.${className}`).clientHeight
            selectOptionsRef.current.style.height = `${optionHeight * optionsAmount}px`
        } else {
            selectOptionsRef.current.style.height = '0px'
        }
    }, [shouldOptionsExpand])
    return (
        <SelectContainer className={error && 'error'}>
            <AHTCForm.Label
                htmlFor={id}
                onClick={() => setShouldOptionsExpand(shouldOptionsExpand => !shouldOptionsExpand)}
            >
                {label}
            </AHTCForm.Label>
            <StyledSelect.Select
                onClick={() => setShouldOptionsExpand(shouldOptionsExpand => !shouldOptionsExpand)}
            >
                {value || placeholder}
            </StyledSelect.Select>
            <StyledSelect.OptionsContainer ref={selectOptionsRef} expanded={shouldOptionsExpand}>
                {options.map(option => (
                    <StyledSelect.Option
                        key={option}
                        className={className}
                        onClick={() => {
                            onChange(option)
                            setShouldOptionsExpand(false)
                        }}
                        active={option === value}
                    >
                        {option}
                    </StyledSelect.Option>
                ))}
            </StyledSelect.OptionsContainer>
            {error && <AHTCForm.Error>{error}</AHTCForm.Error>}
        </SelectContainer>
    )
}

export default Select
