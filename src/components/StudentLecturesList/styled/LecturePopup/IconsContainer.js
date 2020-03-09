import styled from 'styled-components/macro'

export default styled.div`
    width: 100%;
    padding: 0px 15%;
    display: flex;
    justify-content: space-around;
    align-items: center;
    position: absolute;
    bottom: 35px;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 2;
    @media (max-width: 1250px) {
        bottom: 0px;
        padding: 0px 10%;
    }
`
