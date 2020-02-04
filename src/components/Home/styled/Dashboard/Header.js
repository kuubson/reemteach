import styled from 'styled-components/macro'

export default styled.h1`
    font-size: 20px;
    font-weight: 800;
    margin-bottom: 100px;
    @media (max-width: 1000px) {
        font-size: 18px;
    }
    @media (max-width: 500px) {
        font-size: 16px;
    }
`
