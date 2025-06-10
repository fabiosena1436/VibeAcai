// src/components/Navbar/styles.js

import styled from 'styled-components';
import { NavLink as RouterNavLink } from 'react-router-dom';

export const NavWrapper = styled.nav`
  background-color: #7c3aed;
  padding: 0 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 70px;
  z-index: 900;

  @media (max-width: 768px) {
    padding: 0 20px;
  }
`;

export const NavLogoLink = styled(RouterNavLink)`
  display: flex;
  align-items: center;
  text-decoration: none;
  font-size: 1.8em;
  font-weight: bold;
  color: #fff;
  z-index: 999;
`;

export const LogoImage = styled.img`
  height: 50px;
  width: auto;
  max-width: 150px;

  @media (max-width: 768px) {
    height: 40px;
  }
`;

export const NavLinksContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 25px;

  @media (max-width: 768px) {
    display: none;
  }
`;

export const NavLink = styled(RouterNavLink)`
  color: #e0d6ff;
  text-decoration: none;
  font-size: 1.1em;
  padding: 8px 12px;
  border-radius: 6px;
  transition: background-color 0.2s ease, color 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
    color: #fff;
  }

  &.active {
    color: #fff;
    font-weight: bold;
    background-color: rgba(255, 255, 255, 0.15);
  }
`;

export const CartItemCount = styled.span`
  background-color: #ef4444;
  color: white;
  border-radius: 50%;
  padding: 2px 8px;
  font-size: 0.8em;
  font-weight: bold;
  min-width: 20px;
  text-align: center;
  line-height: 1.2;
`;

export const MobileIcon = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    font-size: 2rem;
    cursor: pointer;
    color: #fff;
    z-index: 999;
  }
`;

export const MobileMenuWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
  background: #6d28d9;
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100%;
  transition: transform 0.3s ease-in-out;
  transform: ${({ isOpen }) => (isOpen ? 'translateX(0)' : 'translateX(-100%)')};
  z-index: 950;
`;