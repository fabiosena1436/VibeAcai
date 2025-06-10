// src/components/Navbar/styles.js

import styled from 'styled-components';
import { NavLink as RouterNavLink } from 'react-router-dom';

// Adicione este estilo global no componente principal ou crie um GlobalStyle
export const GlobalNavbarStyle = styled.div`
  body {
    overflow-x: hidden !important;
  }
`;

export const NavWrapper = styled.nav`
  background-color: #7c3aed;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 900;
  width: 100%; /* Garante largura total */
  overflow: hidden; /* Previne overflow */
  box-sizing: border-box; /* Inclui padding no cálculo da largura */

  /* Mobile muito pequeno (até 360px) */
  @media (max-width: 360px) {
    height: 50px;
    padding: 0 12px;
  }

  /* Mobile (361px - 480px) */
  @media (min-width: 361px) and (max-width: 480px) {
    height: 55px;
    padding: 0 16px;
  }

  /* Mobile grande (481px - 768px) */
  @media (min-width: 481px) and (max-width: 768px) {
    height: 60px;
    padding: 0 20px;
  }

  /* Tablet (769px - 1024px) */
  @media (min-width: 769px) and (max-width: 1024px) {
    height: 65px;
    padding: 0 25px;
  }

  /* Desktop (1025px+) */
  @media (min-width: 1025px) {
    height: 70px;
    padding: 0 30px;
  }
`;

export const NavLogoLink = styled(RouterNavLink)`
  display: flex;
  align-items: center;
  text-decoration: none;
  font-weight: bold;
  color: #fff;
  z-index: 999;
  transition: transform 0.2s ease;
  flex-shrink: 0; /* Previne que o logo encolha */

  &:hover {
    transform: scale(1.05);
  }

  /* Mobile muito pequeno (até 360px) */
  @media (max-width: 360px) {
    font-size: 1.2em;
  }

  /* Mobile (361px - 480px) */
  @media (min-width: 361px) and (max-width: 480px) {
    font-size: 1.4em;
  }

  /* Mobile grande e maiores (481px+) */
  @media (min-width: 481px) {
    font-size: 1.8em;
  }
`;

export const LogoImage = styled.img`
  width: auto;
  object-fit: contain;

  /* Mobile muito pequeno (até 360px) */
  @media (max-width: 360px) {
    height: 30px;
    max-width: 100px;
  }

  /* Mobile (361px - 480px) */
  @media (min-width: 361px) and (max-width: 480px) {
    height: 35px;
    max-width: 120px;
  }

  /* Mobile grande (481px - 768px) */
  @media (min-width: 481px) and (max-width: 768px) {
    height: 40px;
    max-width: 130px;
  }

  /* Tablet (769px - 1024px) */
  @media (min-width: 769px) and (max-width: 1024px) {
    height: 45px;
    max-width: 140px;
  }

  /* Desktop (1025px+) */
  @media (min-width: 1025px) {
    height: 50px;
    max-width: 150px;
  }
`;

export const NavLinksContainer = styled.div`
  display: flex;
  align-items: center;

  /* Esconde em telas menores que tablet */
  @media (max-width: 768px) {
    display: none;
  }

  /* Tablet (769px - 1024px) */
  @media (min-width: 769px) and (max-width: 1024px) {
    gap: 20px;
  }

  /* Desktop (1025px+) */
  @media (min-width: 1025px) {
    gap: 25px;
  }
`;

export const NavLink = styled(RouterNavLink)`
  color: #e0d6ff;
  text-decoration: none;
  border-radius: 6px;
  transition: background-color 0.2s ease, color 0.2s ease, transform 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  position: relative;
  white-space: nowrap; /* Previne quebra de linha */

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
    color: #fff;
    transform: translateY(-2px);
  }

  &.active {
    color: #fff;
    font-weight: bold;
    background-color: rgba(255, 255, 255, 0.15);
  }

  /* Desktop styles */
  @media (min-width: 769px) {
    font-size: 1.1em;
    padding: 8px 12px;
  }

  /* Mobile styles (para o menu mobile) */
  @media (max-width: 768px) {
    font-size: 1.2em;
    padding: 12px 24px;
    width: 80%;
    max-width: 280px;
    justify-content: center;
    background-color: rgba(255, 255, 255, 0.05);
    margin: 8px 0;

    &:hover {
      background-color: rgba(255, 255, 255, 0.15);
      transform: scale(1.05);
    }
  }

  /* Mobile muito pequeno */
  @media (max-width: 360px) {
    font-size: 1em;
    padding: 10px 20px;
  }
`;

export const CartItemCount = styled.span`
  background-color: #ef4444;
  color: white;
  border-radius: 50%;
  font-weight: bold;
  text-align: center;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0; /* Previne que o contador encolha */

  /* Mobile */
  @media (max-width: 768px) {
    font-size: 0.7em;
    min-width: 18px;
    height: 18px;
    padding: 0 4px;
  }

  /* Desktop */
  @media (min-width: 769px) {
    font-size: 0.8em;
    min-width: 20px;
    height: 20px;
    padding: 0 6px;
  }
`;

export const MobileIcon = styled.div`
  display: none;
  cursor: pointer;
  color: #fff;
  user-select: none;
  transition: transform 0.2s ease;
  flex-shrink: 0; /* Previne que o ícone encolha */

  &:hover {
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }

  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 999;
    padding: 8px;
  }

  /* Mobile muito pequeno (até 360px) */
  @media (max-width: 360px) {
    font-size: 1.5rem;
  }

  /* Mobile (361px - 480px) */
  @media (min-width: 361px) and (max-width: 480px) {
    font-size: 1.7rem;
  }

  /* Mobile grande (481px - 768px) */
  @media (min-width: 481px) and (max-width: 768px) {
    font-size: 2rem;
  }
`;

export const MobileMenuOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 940;
  display: ${({ isOpen }) => (isOpen ? 'block' : 'none')};
  
  @media (min-width: 769px) {
    display: none;
  }
`;

export const MobileMenuWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
  background: #6d28d9;
  position: fixed;
  top: 0;
  left: ${({ isOpen }) => (isOpen ? '0' : '-100%')}; /* Mudança aqui */
  height: 100vh;
  width: 85%;
  max-width: 320px;
  transition: left 0.3s ease-in-out; /* Mudança aqui */
  z-index: 950;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.3);
  overflow-y: auto; /* Permite scroll vertical se necessário */
  overflow-x: hidden; /* Previne scroll horizontal */

  /* Mobile muito pequeno (até 360px) */
  @media (max-width: 360px) {
    width: 80%;
    gap: 8px;
  }

  /* Para telas maiores que tablet, esconde o menu mobile */
  @media (min-width: 769px) {
    display: none;
  }
`;