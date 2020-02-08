import React from 'react'
import styled from 'styled-components/macro'

import { compose } from 'redux'
import { withMenu } from '@hoc'

import StyledMenu from '../styled/Menu'

import HForm from '@components/Home/styled/Form'

import { apiAxios, redirectTo } from '@utils'

const MenuContainer = styled.div`
    width: 350px;
    height: 100vh;
    background: #f24b4b;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    transform: ${({ shown }) => (shown ? 'translate(-0%, 0%)' : 'translate(-100%, 0%)')};
    transition: transform 0.8s ease-in-out;
    position: fixed;
    top: 0px;
    left: 0px;
`

const Menu = ({ children, shouldMenuAppear, setShouldMenuAppear }) => {
    const logout = async () => {
        const url = '/api/logout'
        const response = await apiAxios.get(url)
        if (response) {
            setShouldMenuAppear(false)
            redirectTo('/')
        }
    }
    return (
        <>
            <StyledMenu.Button onClick={() => setShouldMenuAppear(true)} shown={!shouldMenuAppear}>
                Menu
            </StyledMenu.Button>
            <MenuContainer shown={shouldMenuAppear}>
                <HForm.CloseButton onClick={() => setShouldMenuAppear(false)} />
                {children}
                <StyledMenu.Option onClick={logout}>Wyloguj się</StyledMenu.Option>
            </MenuContainer>
        </>
    )
}

export default compose(withMenu)(Menu)
