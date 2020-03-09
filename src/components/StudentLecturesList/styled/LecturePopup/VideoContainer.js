import styled from 'styled-components/macro'

export default styled.div`
    width: 40%;
    height: 100vh;
    background: #f24b4b;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    @media (max-width: 1250px) {
        width: 200px;
        height: 200px;
        background: white;
        position: absolute;
        top: 20px;
        left: 20px;
        z-index: 1;
    }
    @media (max-width: 500px) {
        width: 150px;
        height: 150px;
    }
`
