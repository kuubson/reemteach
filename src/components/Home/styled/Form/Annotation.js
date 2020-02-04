import styled from 'styled-components/macro'

export default styled.p`
    width: 250px;
    margin: 20px auto 0px auto;
    word-break: keep-all;
    font-size: 11px;
    line-height: 1.8;
    @media (max-width: 900px) {
        font-size: 10.5px;
    }
    @media (max-width: 700px) {
        font-size: 10px;
    }
    @media (max-width: 500px) {
        width: 200px;
        font-size: 9.5px;
    }
`
