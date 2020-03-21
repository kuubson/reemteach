import styled from 'styled-components/macro'

export default styled.form`
    width: 450px;
    margin-top: ${({ withLessMargin }) => (withLessMargin ? 30 : 80)}px;
    @media (max-width: 1050px) {
        width: 400px;
    }
    @media (max-width: 850px) {
        width: 85%;
    }
    @media (max-width: 600px) {
        width: 100%;
        margin-top: ${({ withLessMargin }) => (withLessMargin ? 0 : 60)}px;
    }
`
