import styled, { css } from 'styled-components/macro'

export default styled.div`
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    grid-gap: 70px;
    justify-content: center;
    align-items: center;
    text-align: center;
    @media (max-width: 700px) {
        grid-template-columns: 1fr;
    }
    ${({ fullContent }) => {
        if (fullContent)
            return css`
                grid-template-columns: 1fr;
            `
    }}
`
