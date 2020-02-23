import styled, { css } from 'styled-components/macro'

export default styled.li`
    font-size: 12px;
    text-transform: initial;
    flex: 1;
    padding: 15px 10px;
    cursor: pointer;
    :last-of-type {
        margin-bottom: 0px;
    }
    @media (max-width: 600px) {
        font-size: 11px;
    }
    :hover {
        background: #f24b4b;
        color: white;
    }
    ${({ active }) => {
        if (active)
            return css`
                background: #f24b4b;
                color: white;
            `
    }}
`
