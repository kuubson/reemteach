import styled from 'styled-components/macro'

export default styled.button`
    text-align: center;
    display: block;
    padding: 18px 40px;
    white-space: nowrap;
    background: black;
    color: white;
    font-weight: 700;
    font-size: 10px;
    opacity: ${({ shown }) => (shown ? 1 : 0)};
    transition: transform 0.5s ease-in-out, opacity 0.5s ease-in-out;
    position: fixed;
    top: 30px;
    left: 30px;
    :hover {
        transform: scale(1.03);
    }
    @media (max-width: 1000px) {
        font-size: 9.5px;
    }
    @media (max-width: 500px) {
        font-size: 8px;
        padding: 18px 35px;
        top: 20px;
        left: 20px;
    }
`
