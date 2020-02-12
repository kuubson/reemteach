import React from 'react'
import styled from 'styled-components/macro'

import Form from '../styled/Form'

const InputContainer = styled.div`
    margin: 0px 20% 20px 20%;
    :last-of-type {
        margin: 0px 20% 0px 20%;
    }
    @media (max-width: 500px) {
        margin: 0px 15% 20px 15%;
        :last-of-type {
            margin: 0px 15% 0px 15%;
        }
    }
`

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
