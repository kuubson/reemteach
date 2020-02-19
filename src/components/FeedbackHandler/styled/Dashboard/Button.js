import styled from 'styled-components/macro'

export default styled.button`
    font-size: 11px;
    padding: 18px 30px;
    border: 1.5px solid white;
    margin-top: 80px;
    border-radius: 10px;
    @media (max-width: 1050px) {
        font-size: 10.5px;
    }
    @media (max-width: 900px) {
        font-size: 9.5px;
    }
    @media (max-width: 600px) {
        font-size: 8.5px;
    }
    @media (max-width: 500px) {
        font-size: 7.5px;
    }
`
