import styled from 'styled-components/macro'

export default styled.input`
    width: 75%;
    margin: 0px auto;
    margin-top: 20px;
    font-size: 15px;
    text-transform: initial;
    resize: none;
    transition: height 0.5s ease-in-out;
    @media (max-width: 900px) {
        width: 90%;
        font-size: 14px;
    }
    @media (max-width: 500px) {
        width: 100%;
        font-size: 13px;
    }
`
