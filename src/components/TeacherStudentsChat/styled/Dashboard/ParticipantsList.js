import styled from 'styled-components/macro'

export default styled.div`
    width: 350px;
    height: 100vh;
    overflow-y: auto;
    background: rgba(242, 75, 75, 0.9);
    box-shadow: 0px 0px 15px -10px black;
    transform: ${({ visible }) => (visible ? 'translate(0%, 0%)' : 'translate(100%, 0%)')};
    transition: transform 0.8s ease-in-out, width 0.8s ease-in-out, top 0.5s ease-out;
    position: absolute;
    top: 0px;
    right: 0px;
    z-index: 1;
    @media (max-width: 900px) {
        width: 100%;
        position: fixed;
    }
`
