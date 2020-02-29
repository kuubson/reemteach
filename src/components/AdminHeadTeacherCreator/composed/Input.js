import React, { useEffect, useRef } from 'react'
import styled from 'styled-components/macro'

import Form from '../styled/Form'

const InputContainer = styled.div`
    width: 100%;
    margin: ${({ double }) => (double ? '0px 15px 0px 0px' : '0px 0px 25px 0px')};
    :last-of-type {
        margin: 0px;
    }
`

const Input = ({
    id,
    label,
    value,
    placeholder,
    error,
    onChange,
    textarea,
    secure,
    trim,
    double
}) => {
    const textareaRef = useRef()
    useEffect(() => {
        if (textarea && textareaRef.current) {
            if (!value) {
                textareaRef.current.style.height = '50px'
            } else {
                textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
            }
        }
    }, [value])
    const handleOnChange = ({ target }) => {
        const value = trim ? target.value.trim() : target.value
        onChange(value)
    }
    return (
        <InputContainer className={error && 'error'} double={double}>
            <Form.Label htmlFor={id}>{label}</Form.Label>
            {textarea ? (
                <Form.Textarea
                    ref={textareaRef}
                    id={id}
                    name={id}
                    value={value}
                    placeholder={placeholder}
                    onChange={handleOnChange}
                />
            ) : (
                <Form.Input
                    id={id}
                    name={id}
                    type={secure ? 'password' : 'text'}
                    value={value}
                    placeholder={placeholder}
                    onChange={handleOnChange}
                />
            )}
            {error && <Form.Error>{error}</Form.Error>}
        </InputContainer>
    )
}

export default Input
