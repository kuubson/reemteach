import styled from 'styled-components/macro'

export default styled.h1`
    font-size: 15.5px;
    line-height: 1.5;
    span {
        font-weight: 700;
    }
    @media (max-width: 900px) {
        font-size: 14.5px;
    }
    @media (max-width: 700px) {
        font-size: 13.5px;
    }
`
