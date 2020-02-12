import styled from 'styled-components/macro'

export default styled.p`
    max-width: 65%;
    font-size: 13.5px;
    text-align: center;
    padding: 0px 25px;
    line-height: 1.7;
    color: white;
    @media (max-width: 1050px) {
        font-size: 12px;
    }
    @media (max-width: 700px) {
        max-width: 300px;
    }
    @media (max-width: 500px) {
        font-size: 11px;
    }
`
