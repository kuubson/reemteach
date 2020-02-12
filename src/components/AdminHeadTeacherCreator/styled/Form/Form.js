import styled from 'styled-components/macro'

export default styled.form`
    width: 450px;
    margin-top: 80px;
    @media (max-width: 1050px) {
        width: 400px;
    }
    @media (max-width: 850px) {
        width: 80%;
    }
    @media (max-width: 500px) {
        width: 100%;
    }
`
