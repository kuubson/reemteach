import styled from 'styled-components/macro'

export default styled.label`
    width: 180px;
    background: black;
    font-size: 9.5px;
    cursor: pointer;
    padding: ${({ withImage }) => (withImage ? '20px 40px 20px 20px' : '20px')};
    color: white;
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    transition: transform 0.5s ease-in-out;
    position: relative;
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
