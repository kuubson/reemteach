import styled, { css } from 'styled-components/macro'

export default styled.div`
    width: 100%;
    height: 100%;
    transition: width 0.8s ease-in-out;
    padding: 114.8px 30px 50px 30px;
    position: absolute;
    bottom: 0px;
    left: 0px;
    @media (max-width: 500px) {
        padding: 100px 20px 50px 20px;
    }
    ${({ shorter }) => {
        if (shorter)
            return css`
                width: calc(100% - 350px);
                @media (max-width: 900px) {
                    width: 100%;
                }
            `
    }}
    ${({ withoutMessages }) => {
        if (withoutMessages) {
            return css`
                padding: 0px 30px;
            `
        }
    }}
`
