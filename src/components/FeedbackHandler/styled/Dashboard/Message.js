import styled from 'styled-components/macro'

export default styled.p`
    width: 600px;
    font-size: 14px;
    color: white;
    text-align: center;
    line-height: 1.7;
    @media (max-width: 1050px) {
        font-size: 13.5px;
    }
    @media (max-width: 900px) {
        font-size: 12.5px;
    }
    @media (max-width: 600px) {
        width: 85%;
        font-size: 11.5px;
    }
    @media (max-width: 500px) {
        font-size: 10px;
    }
`
