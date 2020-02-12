import styled from 'styled-components/macro'

export default styled.p`
    margin-top: 12px;
    font-size: 15px;
    text-transform: initial;
    @media (max-width: 900px) {
        font-size: 14px;
    }
    @media (max-width: 500px) {
        font-size: 13px;
    }
`
