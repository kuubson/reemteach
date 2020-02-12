import styled from 'styled-components/macro'

export default styled.p`
    text-align: center;
    margin-top: 15px;
    font-weight: 700;
    color: red;
    text-transform: initial;
    font-size: 12px;
    @media (max-width: 700px) {
        font-size: 11px;
    }
    @media (max-width: 600px) {
        font-size: 9px;
    }
`
