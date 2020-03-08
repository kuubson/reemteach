import styled from 'styled-components/macro'

export default styled.div`
    width: ${({ big }) => (big ? 60 : 55)}px;
    height: ${({ big }) => (big ? 60 : 55)}px;
    background: white;
    box-shadow: 0px 0px 10px -5px black;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    transition: transform 0.3s ease-in-out;
    :hover {
        transform: scale(1.05);
    }
`
