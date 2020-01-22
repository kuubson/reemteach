import styled from 'styled-components/macro'

export default styled.p`
    max-width: 500px;
    font-size: 13.5px;
    text-align: center;
    line-height: 1.7;
    @media (max-width: 1050px) {
        font-size: 12px;
    }
    @media (max-width: 700px) {
        max-width: 300px;
    }
    @media (max-width: 500px) {
        font-size: 10px;
    }
`
