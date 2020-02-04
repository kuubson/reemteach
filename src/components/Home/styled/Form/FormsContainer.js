import styled from 'styled-components/macro'

export default styled.div`
    width: 800px;
    height: 85%;
    background: #f24b4b;
    box-shadow: 0px 0px 15px -5px black;
    transform-style: preserve-3d;
    position: absolute;
    transition: transform 0.7s ease-in-out, top 0.7s ease-in-out, left 0.7s ease-in-out,
        width 0.4s ease-in-out, height 0.4s ease-in-out;
    @media (max-width: 900px) {
        width: 700px;
    }
    @media (max-width: 800px) {
        width: 90%;
    }
    @media (max-width: 500px) {
        width: 100%;
        height: 100%;
    }
`
