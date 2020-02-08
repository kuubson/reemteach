import styled from 'styled-components/macro'

export default styled.li`
    color: white;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
    margin-bottom: 30px;
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
    @media (max-width: 500px) {
        font-size: 12px;
    }
`
