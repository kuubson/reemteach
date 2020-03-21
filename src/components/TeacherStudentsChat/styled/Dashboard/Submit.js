import styled from 'styled-components/macro'

export default styled.button`
    height: 100%;
    font-size: 9px;
    font-weight: 700;
    padding: 0px 25px;
    transition: background 0.3s ease-in-out, color 0.2s ease-in-out;
    :hover {
        background: rgba(242, 75, 75, 0.95);
        color: white;
    }
    @media (max-width: 900px) {
        font-size: 8px;
    }
    @media (max-width: 500px) {
        font-size: 7.5px;
    }
`
