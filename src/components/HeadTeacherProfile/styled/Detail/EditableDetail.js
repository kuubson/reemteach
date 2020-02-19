import styled from 'styled-components/macro'

export default styled.input`
    width: 100%;
    margin-top: 20px;
    font-size: 15px;
    text-transform: initial;
    resize: none;
    transition: height 0.5s ease-in-out;
    @media (max-width: 900px) {
        font-size: 14px;
    }
    @media (max-width: 500px) {
        font-size: 13px;
    }
`
