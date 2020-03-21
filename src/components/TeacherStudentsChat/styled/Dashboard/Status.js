import styled from 'styled-components/macro'

export default styled.div`
    width: 12px;
    height: 12px;
    box-shadow: 0px 0px 3px -1px black;
    border-radius: 50%;
    margin-right: 20px;
    background: ${({ online }) => (online ? 'green' : 'red')};
    @media (max-width: 500px) {
        width: 10px;
        height: 10px;
    }
`
