import styled from 'styled-components/macro'

export default styled.img`
    width: 280px;
    height: 280px;
    margin-top: -50px;
    margin-bottom: 25px;
    @media (max-width: 500px) {
        margin-top: -75px;
        width: 240px;
        height: 240px;
    }
`
