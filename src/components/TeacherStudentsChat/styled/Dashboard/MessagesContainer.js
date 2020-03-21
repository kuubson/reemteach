import styled, { css } from 'styled-components/macro'

export default styled.div`
    height: 100%;
    width: 100%;
    overflow: scroll;
    position: relative;
    padding-bottom: 20px;
    ${({ withoutMessages }) => {
        if (withoutMessages) {
            return css`
                display: flex;
                justify-content: center;
                align-items: center;
            `
        }
    }}
`
