import styled from 'styled-components/macro'

export default styled.p`
    font-size: 13px;
    font-weight: 600;
    @media (max-width: 1000px) {
        font-size: 11.5px;
    }
    @media (max-width: 500px) {
        font-size: 10px;
    }
`
