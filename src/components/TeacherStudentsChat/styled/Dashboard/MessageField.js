import styled from 'styled-components/macro'

export default styled.textarea`
    width: 100%;
    height: 100%;
    text-transform: initial;
    letter-spacing: 1.5px;
    font-size: 12px;
    resize: none;
    padding: 10px 0px 8px 10px;
    ::placeholder {
        color: black;
    }
    @media (max-width: 900px) {
        font-size: 11px;
    }
    @media (max-width: 500px) {
        font-size: 9px;
    }
`
