import styled from 'styled-components/macro'

export default styled.h2`
    width: 250px;
    margin: 0px auto 0px auto;
    word-break: keep-all;
    font-weight: 800;
    line-height: 1.5;
    @media (max-width: 900px) {
        font-size: 15px;
    }
    @media (max-width: 700px) {
        font-size: 14px;
    }
    @media (max-width: 500px) {
        font-size: 13px;
    }
`
