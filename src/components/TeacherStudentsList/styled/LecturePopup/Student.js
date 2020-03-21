import styled from 'styled-components/macro'

export default styled.p`
    font-weight: 800;
    color: white;
    max-width: 140px;
    text-overflow: ellipsis;
    overflow: hidden;
    text-align: left;
    font-size: 11px;
    filter: drop-shadow(0px 0px 1px black);
    position: absolute;
    top: 15px;
    left: 15px;
    @media (max-width: 1250px) {
        font-size: 9px;
    }
`
