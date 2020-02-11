import styled from 'styled-components/macro'

export default styled.div`
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    @media (max-width: 500px) {
        grid-template-columns: 1fr;
    }
`
