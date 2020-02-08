import styled from 'styled-components/macro'

export default styled.h1`
    font-size: 19px;
    text-transform: initial;
    line-height: 1.5;
    span {
        text-transform: initial;
        font-weight: 700;
    }
    @media (max-width: 1150px) {
        font-size: 18px;
    }
    @media (max-width: 900px) {
        font-size: 17px;
    }
    @media (max-width: 700px) {
        font-size: 15.5px;
    }
`
