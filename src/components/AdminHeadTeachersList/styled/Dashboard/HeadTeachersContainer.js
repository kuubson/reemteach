import styled from 'styled-components/macro'

export default styled.div`
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    grid-gap: 70px;
    justify-content: center;
    align-items: center;
    @media (max-width: 500px) {
        grid-template-columns: 1fr;
    }
`
