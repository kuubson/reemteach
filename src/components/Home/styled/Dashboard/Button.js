import styled from 'styled-components/macro'

export default styled.button`
    min-width: 200px;
    text-align: center;
    display: block;
    margin: 20px 0px;
    padding: 20px 0px;
    white-space: nowrap;
    background: black;
    color: white;
    font-size: 10px;
    transition: transform 0.5s;
    :hover {
        transform: scale(1.03);
    }
    @media (max-width: 1000px) {
        min-width: 190px;
        font-size: 9.5px;
    }
    @media (max-width: 500px) {
        font-size: 8px;
    }
`
