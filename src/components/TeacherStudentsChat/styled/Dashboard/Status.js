import styled from 'styled-components/macro'

export default styled.div`
    width: 9px;
    height: 9px;
    box-shadow: 0px 0px 3px -1px black;
    border-radius: 50%;
    margin-right: 20px;
    background: ${({ online }) => (online ? 'green' : 'red')};
`
