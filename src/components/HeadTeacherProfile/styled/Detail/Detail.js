import styled from 'styled-components/macro'

export default styled.p`
    width: 100%;
    margin: 20px auto 0px auto;
    white-space: pre-line;
    word-break: break-all;
    overflow: hidden;
    font-size: 15px;
    text-transform: initial;
    resize: none;
    transition: height 0.5s ease-in-out;
    @media (max-width: 900px) {
        font-size: 14px;
    }
    @media (max-width: 500px) {
        width: 100%;
        font-size: 13px;
    }
`
