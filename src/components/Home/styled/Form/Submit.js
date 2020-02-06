import styled from 'styled-components/macro'

export default styled.button`
    margin: 45px auto 0px auto;
    font-weight: 600;
    border: 2px solid white;
    padding: 19px 40px;
    font-size: 9.5px;
    @media (max-width: 700px) {
        font-size: 8.5px;
    }
    @media (max-width: 500px) {
        font-size: 7.5px;
    }
`
