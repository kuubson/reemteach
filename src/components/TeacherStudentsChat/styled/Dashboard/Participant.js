import styled from 'styled-components/macro'

export default styled.p`
    color: white;
    font-size: 12px;
    text-transform: initial;
    white-space: pre-line;
    word-break: keep-all;
    font-weight: 700;
    line-height: 1.5;
    text-align: center;
    @media (max-width: 800px) {
        font-size: 11px;
    }
    @media (max-width: 500px) {
        font-size: 10px;
    }
`
