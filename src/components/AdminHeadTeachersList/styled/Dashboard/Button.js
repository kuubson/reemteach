import styled from 'styled-components/macro'

export default styled.button`
    margin: 0px auto 20px auto;
    font-weight: 700;
    border: 1.5px solid black;
    text-align: center;
    padding: 18px 40px;
    font-size: 9.5px;
    color: black;
    transition: transform 0.5s ease-in-out;
    :hover {
        transform: scale(1.03);
    }
    :last-of-type {
        margin: 0px auto 0px auto;
    }
    @media (max-width: 700px) {
        font-size: 8.5px;
    }
    @media (max-width: 600px) {
        font-size: 7.5px;
    }
`
