import styled from 'styled-components/macro'

export default styled.p`
    max-width: 550px;
    margin: 0px auto;
    font-weight: 700;
    font-size: 12px;
    line-height: 1.5;
    text-align: center;
    margin-top: 20px;
    padding: 0px 15px;
    @media (max-width: 1100px) {
        font-size: 11.5px;
    }
    @media (max-width: 1000px) {
        max-width: 450px;
    }
    @media (max-width: 700px) {
        max-width: 100%;
        font-size: 10px;
    }
    @media (max-width: 500px) {
        font-size: 9px;
    }
`
