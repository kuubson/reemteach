import styled from 'styled-components/macro'

export default styled.div`
    height: 100%;
    width: 100%;
    color: white;
    transform: ${({ back }) => (back ? 'rotateY(180deg)' : 'initial')};
    display: flex;
    justify-content: center;
    align-items: center;
    backface-visibility: hidden;
    position: absolute;
    z-index: 2;
`
