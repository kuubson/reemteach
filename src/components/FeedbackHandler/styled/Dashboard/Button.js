import styled from 'styled-components/macro'

export default styled.button`
    color: white;
    margin-top: 90px;
    padding: 18px 30px;
    font-size: 11.5px;
    border-radius: 10px;
    border: 1.5px solid white;
    @media (max-width: 1050px) {
        font-size: 9.5px;
    }
    @media (max-width: 500px) {
        font-size: 7px;
    }
`
