import styled from 'styled-components/macro'

export default styled.p`
    font-size: 13px;
    font-weight: 700;
    line-height: 1.5;
    color: ${({ withTeacher }) => (withTeacher ? '#f24b4b' : 'black')};
    text-align: left;
    text-transform: initial;
    margin-bottom: 10px;
    :last-of-type {
        margin-bottom: 0px;
    }
    @media (max-width: 1050px) {
        font-size: 12px;
    }
    @media (max-width: 800px) {
        font-size: 11px;
    }
    @media (max-width: 600px) {
        font-size: 10px;
    }
`
