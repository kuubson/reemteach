import React from 'react'
import styled from 'styled-components/macro'

import Form from '../styled/Form'

const InputContainer = styled.div``

const Input = ({ id, label, value, placeholder, error, onChange, secure, trim }) => {
    const handleOnChange = ({ target }) => {
        const value = trim ? target.value.trim() : target.value
        onChange(value)
    }
    return (
        <InputContainer className={error && 'error'}>
            <Form.Label htmlFor={id}>{label}</Form.Label>
            <Form.Input
                id={id}
                name={id}
                type={secure ? 'password' : 'text'}
                value={value}
                placeholder={placeholder}
                onChange={handleOnChange}
            />
            {error && <Form.Error>{error}</Form.Error>}
        </InputContainer>
    )
}

export default Input
