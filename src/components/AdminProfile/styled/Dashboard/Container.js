import styled, { css } from 'styled-components/macro'

export default styled.section`
    width: 100%;
    padding: ${({ withMorePadding }) => (withMorePadding ? '50px' : '0px 50px')};
    transition: width 0.8s ease-in-out, margin-left 0.8s ease-in-out, padding 0.8s ease-in-out;
    @media (max-width: 850px) {
        padding: 126.4px 50px 50px 50px;
    }
    @media (max-width: 500px) {
        padding: 114.8px 50px 50px 50px;
    }
    ${({ withMenu }) => {
        if (withMenu)
            return css`
                width: calc(100% - 350px);
                margin-left: 350px;
                @media (max-width: 1000px) {
                    width: calc(100% - 300px);
                    margin-left: 300px;
                }
                @media (max-width: 850px) {
                    padding: ${({ withMorePadding }) => (withMorePadding ? '50px' : '0px 50px')};
                }
                @media (max-width: 800px) {
                    width: calc(100% - 250px);
                    margin-left: 250px;
                }
                @media (max-width: 600px) {
                    width: calc(100% - 200px);
                    margin-left: 200px;
                }
                @media (max-width: 500px) {
                    width: 100%;
                    padding: 114.8px 50px 50px 50px;
                    margin-left: 0px;
                }
            `
    }}
`
