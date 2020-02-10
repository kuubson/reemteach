import styled from 'styled-components/macro'

export default styled.button`
    margin: 40px auto 0px auto;
    font-weight: 600;
    border: 1px solid black;
    text-align: center;
    padding: 19px 40px;
    font-size: 9.5px;
    color: black;
    transition: transform 0.5s ease-in-out;
    @media (max-width: 700px) {
        font-size: 8.5px;
    }
    @media (max-width: 500px) {
        font-size: 7.5px;
    }
    :hover {
        transform: scale(1.03);
    }
`
