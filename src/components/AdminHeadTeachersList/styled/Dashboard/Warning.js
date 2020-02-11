import styled from 'styled-components/macro'

export default styled.p`
    font-weight: 700;
    font-size: 14px;
    text-align: center;
    @media (max-width: 1100px) {
        font-size: 12.5px;
    }
    @media (max-width: 700px) {
        font-size: 11px;
    }
    @media (max-width: 500px) {
        font-size: 10px;
    }
`
