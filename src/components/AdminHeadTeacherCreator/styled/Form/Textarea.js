import styled from 'styled-components/macro'

export default styled.textarea`
    width: 100%;
    font-size: 12px;
    min-height: 50px;
    text-transform: initial;
    border-bottom: 1px solid black;
    text-indent: 1px;
    resize: none;
    transition: height 0.5s ease-in-out;
    ::placeholder {
        color: black;
    }
    @media (max-width: 600px) {
        font-size: 11px;
    }
`
