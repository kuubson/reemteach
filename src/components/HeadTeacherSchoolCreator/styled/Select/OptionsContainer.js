import styled from 'styled-components/macro'

export default styled.ul`
    margin-top: ${({ expanded }) => (expanded ? 10 : 0)}px;
    max-height: ${({ expanded }) => (expanded ? 132.8 : 0)}px;
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid black;
    opacity: ${({ expanded }) => (expanded ? 1 : 0)};
    transition: ${({ expanded }) =>
        expanded
            ? 'max-height 0.5s ease-in-out, opacity 0.5s linear 0.2s, margin-top 0.5s ease-in-out'
            : 'max-height 0.5s ease-in-out, opacity 0s, margin-top 0.5s ease-in-out'};
    @media (max-width: 600px) {
        max-height: ${({ expanded }) => (expanded ? 128 : 0)}px;
    }
`
