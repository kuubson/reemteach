import styled from 'styled-components/macro'

export default styled.div`
    width: 100%;
    height: 51px;
    border-top: 1.5px solid #f24b4b;
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    bottom: 0px;
    left: 0px;
    @media (max-width: 500px) {
        height: 48px;
    }
`
