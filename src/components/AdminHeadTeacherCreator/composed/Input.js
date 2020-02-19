import React, { useEffect, useRef } from 'react'
import styled from 'styled-components/macro'

import Form from '../styled/Form'

const InputContainer = styled.div`
    margin-bottom: 25px;
    :last-of-type {
        margin-bottom: 0px;
    }
`

const Input = ({ id, label, value, placeholder, error, onChange, textarea, secure, trim }) => {
    const textareaRef = useRef()
    useEffect(() => {
        if (!value && textareaRef.current) {
            textareaRef.current.style.height = '50px'
        } else {
            if (textarea && textareaRef.current) {
                textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
            }
        }
    }, [value])
    const handleOnChange = ({ target }) => {
        const value = trim ? target.value.trim() : target.value
        onChange(value)
    }
    return (
        <InputContainer className={error && 'error'}>
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
