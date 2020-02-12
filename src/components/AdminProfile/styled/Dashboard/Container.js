import styled, { css } from 'styled-components/macro'

export default styled.section`
    width: ${({ withMenu }) => (withMenu ? 'calc(100% - 350px)' : '100%')};
    margin-left: ${({ withMenu }) => (withMenu ? '350px' : '0px')};
    padding: ${({ withMenu }) => (withMenu ? '0px 50px' : '77.2px 50px 0px 50px')};
    transition: width 0.8s ease-in-out, margin-left 0.8s ease-in-out, padding 0.8s ease-in-out;
    @media (max-width: 1050px) {
        width: ${({ withMenu }) => (withMenu ? 'calc(100% - 300px)' : '100%')};
        margin-left: ${({ withMenu }) => (withMenu ? '300px' : '0px')};
    }
    @media (max-width: 1000px) {
        padding: ${({ withMenu }) => (withMenu ? '0px 50px' : '76.4px 50px 0px 50px')};
    }
    @media (max-width: 800px) {
        width: ${({ withMenu }) => (withMenu ? 'calc(100% - 250px)' : '100%')};
        margin-left: ${({ withMenu }) => (withMenu ? '250px' : '0px')};
    }
    @media (max-width: 600px) {
        width: ${({ withMenu }) => (withMenu ? 'calc(100% - 200px)' : '100%')};
        margin-left: ${({ withMenu }) => (withMenu ? '200px' : '0px')};
    }
    @media (max-width: 500px) {
        width: 100%;
        margin-left: 0px;
        padding: 64.8px 50px 0px 50px;
    }
    ${({ morePadding }) => {
        if (morePadding)
            return css`
                padding-top: 148px;
                padding-bottom: 47.2px;
                @media (max-width: 1000px) {
                    padding-top: 146px;
                    padding-bottom: 46.4px;
                }
                @media (max-width: 500px) {
                    padding-top: 132px;
                    padding-bottom: 44.8px;
                }
            `
    }}
`
