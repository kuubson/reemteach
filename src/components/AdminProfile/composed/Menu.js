import React, { useEffect, useRef } from 'react'
import styled from 'styled-components/macro'

import { compose } from 'redux'
import { withMenu } from '@hoc'

import HForm from '@components/Home/styled/Form'
import StyledMenu from '../styled/Menu'

import { delayedApiAxios, delayedRedirectTo } from '@utils'

const MenuContainer = styled.div`
    width: 350px;
    height: 100vh;
    overflow-y: auto;
    background: #f24b4b;
    transform: ${({ visible }) => (visible ? 'translate(-0%, 0%)' : 'translate(-100%, 0%)')};
    transition: transform 0.8s ease-in-out, width 0.8s ease-in-out, top 0.5s ease-out;
    position: absolute;
    top: 0px;
    left: 0px;
    z-index: 1;
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
        position: fixed;
    }
`

const Menu = ({ children, shouldMenuAppear, setShouldMenuAppear }) => {
    const menuRef = useRef()
    const handleOnScroll = () => {
        if (window.innerWidth > 500 && menuRef.current) {
            menuRef.current.style.top = `${window.scrollY}px`
        }
    }
    useEffect(() => {
        window.addEventListener('scroll', handleOnScroll)
        setTimeout(() => {
            if (shouldMenuAppear === undefined) {
                setShouldMenuAppear(false)
            }
        }, 800)
        return () => window.removeEventListener('scroll', handleOnScroll)
    }, [])
    const logout = async () => {
        const url = '/api/logout'
        const response = await delayedApiAxios.get(url)
        if (response) {
            delayedRedirectTo('/')
        }
    }
    return (
        <>
            <StyledMenu.Button
                onClick={() => setShouldMenuAppear(true)}
                visible={!shouldMenuAppear}
            >
                Menu
            </StyledMenu.Button>
            {(shouldMenuAppear === true || shouldMenuAppear === false) && (
                <MenuContainer ref={menuRef} visible={shouldMenuAppear}>
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
