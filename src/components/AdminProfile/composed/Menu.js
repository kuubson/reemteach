import React, { useEffect } from 'react'
import styled from 'styled-components/macro'

import { compose } from 'redux'
import { withMenu } from '@hoc'

import StyledMenu from '../styled/Menu'

import HForm from '@components/Home/styled/Form'

import { delayedApiAxios, redirectTo } from '@utils'

const MenuContainer = styled.div`
    width: 350px;
    height: 100vh;
    overflow-y: auto;
    background: #f24b4b;
    transform: ${({ shown }) => (shown ? 'translate(-0%, 0%)' : 'translate(-100%, 0%)')};
    transition: transform 0.8s ease-in-out, width 0.8s ease-in-out;
    position: fixed;
    top: 0px;
    left: 0px;
    @media (max-width: 1050px) {
        width: 300px;
    }
    @media (max-width: 800px) {
        width: 250px;
    }
    @media (max-width: 600px) {
        width: 200px;
    }
    @media (max-width: 500px) {
        width: 100%;
    }
`

const Menu = ({ children, shouldMenuAppear, setShouldMenuAppear }) => {
    const logout = async () => {
        const url = '/api/logout'
        const response = await delayedApiAxios.get(url)
        if (response) {
            setShouldMenuAppear(false)
            setTimeout(() => {
                setShouldMenuAppear()
                redirectTo('/')
            }, 800)
        }
    }
    useEffect(() => {
        setTimeout(() => {
            if (shouldMenuAppear === undefined) {
                setShouldMenuAppear(false)
            }
        }, 800)
    }, [])
    return (
        <>
            <StyledMenu.Button onClick={() => setShouldMenuAppear(true)} shown={!shouldMenuAppear}>
                Menu
            </StyledMenu.Button>
            {(shouldMenuAppear === true || shouldMenuAppear === false) && (
                <MenuContainer shown={shouldMenuAppear}>
                    <HForm.CloseButton onClick={() => setShouldMenuAppear(false)} />
                    <StyledMenu.OptionsContainer>
                        {children}
                        <StyledMenu.Option onClick={logout}>Wyloguj się</StyledMenu.Option>
                    </StyledMenu.OptionsContainer>
                </MenuContainer>
            )}
        </>
    )
}

export default compose(withMenu)(Menu)
