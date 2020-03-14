import styled from 'styled-components/macro'

export default styled.label`
    width: 180px;
    font-size: 9.5px;
    cursor: pointer;
    padding: 20px 0px;
    background: black;
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: transform 0.5s ease-in-out;
    :hover {
        transform: scale(1.03);
    }
    @media (max-width: 700px) {
        width: 175px;
        font-size: 8.5px;
    }
    @media (max-width: 600px) {
        width: 160px;
        font-size: 7.5px;
    }
`
