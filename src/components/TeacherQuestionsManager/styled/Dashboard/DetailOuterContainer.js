import styled, { css } from 'styled-components/macro'

export default styled.div`
    ${({ selected }) => {
        if (selected)
            return css`
                color: green;
                font-weight: 800;
            `
    }}
`
