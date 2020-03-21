import styled from 'styled-components/macro'

export default styled.div`
    min-width: 150px;
    max-width: 200px;
    height: 100%;
    padding: 15px 20px;
    text-overflow: ellipsis;
    overflow: hidden;
    color: white;
    text-transform: initial;
    white-space: pre-line;
    text-align: center;
    font-weight: 800;
    @media (max-width: 500px) {
        font-size: 10px;
    }
`
