import styled from 'styled-components/macro'

export default styled.p`
    font-weight: 800;
    color: white;
    font-size: 13px;
    max-width: 200px;
    text-overflow: ellipsis;
    overflow: hidden;
    filter: drop-shadow(0px 0px 1px black);
    position: absolute;
    bottom: 25px;
    right: 25px;
    @media (max-width: 700px) {
        font-size: 12px;
        bottom: 22px;
        right: 22px;
    }
    @media (max-width: 500px) {
        font-size: 11px;
        bottom: 20px;
        right: 20px;
    }
`
