import React, { useState } from 'react'
import styled from 'styled-components/macro'

import AHTCForm from '@components/AdminHeadTeacherCreator/styled/Form'
import StyledSelect from '../styled/Select'

const SelectContainer = styled.div`
    margin-bottom: 25px;
    :last-of-type {
        margin-bottom: 0px;
    }
`

const Select = ({ id, label, value, placeholder, options, error, onChange }) => {
    const [shouldOptionsExpand, setShouldOptionsExpand] = useState(false)
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
            <StyledSelect.OptionsContainer expanded={shouldOptionsExpand}>
                {options.map(option => (
                    <StyledSelect.Option
                        key={option}
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
