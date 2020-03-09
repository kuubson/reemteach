import styled from 'styled-components/macro'

export default styled.p`
    font-weight: 800;
    color: white;
    font-size: 13px;
    position: absolute;
    bottom: 25px;
    right: 25px;
    @media (max-width: 1250px) {
        font-size: 9px;
        top: 15px;
        left: 15px;
        bottom: auto;
        right: auto;
    }
`
