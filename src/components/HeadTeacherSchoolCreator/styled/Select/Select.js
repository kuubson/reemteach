import styled from 'styled-components/macro'

export default styled.div`
    width: 100%;
    height: 45px;
    font-size: 12px;
    border: 1px solid black;
    border-radius: 8px;
    cursor: pointer;
    padding-left: 10px;
    display: flex;
    justify-content: center;
    flex-direction: column;
    text-transform: initial;
    ::placeholder {
        color: black;
    }
    @media (max-width: 600px) {
        font-size: 11px;
    }
`
