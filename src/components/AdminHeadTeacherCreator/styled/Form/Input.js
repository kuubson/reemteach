import styled from 'styled-components/macro'

export default styled.input`
    width: 100%;
    font-size: 12px;
    text-transform: initial;
    border-bottom: 1px solid black;
    padding-bottom: 14px;
    ::placeholder {
        color: black;
    }
    @media (max-width: 600px) {
        font-size: 11px;
    }
`
