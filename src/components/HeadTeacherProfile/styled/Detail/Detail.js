import styled, { css } from 'styled-components/macro'

export default styled.p`
    width: 100%;
    overflow: hidden;
    margin: 20px auto 0px auto;
    max-width: 300px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: pre-line;
    font-size: 15px;
    text-transform: initial;
    resize: none;
    transition: height 0.5s ease-in-out, min-height 0.5s ease-in-out;
    @media (max-width: 900px) {
        font-size: 14px;
    }
    @media (max-width: 500px) {
        width: 100%;
        max-width: 200px;
        font-size: 13px;
    }
    ${({ fullContent }) => {
        if (fullContent)
            return css`
                max-width: 700px;
                @media (max-width: 1200px) {
                    max-width: 500px;
                }
                @media (max-width: 1000px) {
                    max-width: 100%;
                }
                text-overflow: initial;
                overflow: initial;
                word-break: break-all;
            `
    }}
`
