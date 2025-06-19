import styled from 'styled-components';
import { NavLink as RouterNavLink } from 'react-router-dom';

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
  width: 100%;
  box-sizing: border-box;
  height: 70px;
  padding: 0 30px;

  @media (max-width: 768px) {
    padding: 0 20px;
    height: 60px;
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
  flex-shrink: 0;

  &:hover {
    transform: scale(1.05);
  }
  
  font-size: 1.8em;
  @media (max-width: 480px) {
    font-size: 1.4em;
  }
`;

export const LogoImage = styled.img`
  height: 50px;
  max-width: 150px;
  object-fit: contain;
  @media (max-width: 768px) {
    height: 40px;
    max-width: 130px;
  }
  @media (max-width: 480px) {
    height: 35px;
    max-width: 120px;
  }
`;

// Container do Menu Desktop (inalterado)
export const NavLinksContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 25px;
  @media (max-width: 768px) {
    display: none;
  }
`;

// Link de navegação padrão (usado no desktop e menu mobile)
export const NavLink = styled(RouterNavLink)`
  color: #e0d6ff;
  text-decoration: none;
  border-radius: 6px;
  transition: background-color 0.2s ease, color 0.2s ease, transform 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  position: relative;
  white-space: nowrap;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
    color: #fff;
  }
  &.active {
    color: #fff;
    font-weight: bold;
  }

  /* Estilos Desktop */
  @media (min-width: 769px) {
    font-size: 1.1em;
    padding: 8px 12px;
    &:hover { transform: translateY(-2px); }
    &.active { background-color: rgba(255, 255, 255, 0.15); }
  }

  /* Estilos para o Menu Mobile que desliza */
  @media (max-width: 768px) {
    font-size: 1.2em;
    padding: 12px 24px;
    width: 80%;
    max-width: 280px;
    justify-content: center;
    background-color: rgba(255, 255, 255, 0.05);
    margin: 8px 0;
    &:hover { transform: scale(1.05); }
  }
`;

// Ícone do Carrinho para o Cabeçalho Mobile
export const MobileCartLink = styled(RouterNavLink)`
  position: relative;
  color: #fff;
  font-size: 1.7rem; // Tamanho do ícone
  display: flex;
  align-items: center;
  padding: 8px;
`;

export const CartItemCount = styled.span`
  background-color: #ef4444;
  color: white;
  border-radius: 50%;
  font-weight: bold;
  text-align: center;
  font-size: 0.7em;
  min-width: 20px;
  height: 20px;
  padding: 0 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  /* NOVO: Posicionamento absoluto para a bolinha */
  position: absolute;
  top: 0;
  right: 0;
  transform: translate(40%, -40%);
  border: 2px solid #7c3aed;
`;

// NOVO: Container para agrupar o carrinho e o menu no mobile
export const MobileActionsContainer = styled.div`
  display: none; // Escondido no desktop
  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    gap: 12px; // Espaçamento entre o carrinho e o menu
  }
`;

export const MobileIcon = styled.div`
  cursor: pointer;
  color: #fff;
  user-select: none;
  transition: transform 0.2s ease;
  font-size: 2rem;
  z-index: 999;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    transform: scale(1.1);
  }
`;

// Menu que desliza (Overlay e Wrapper)
export const MobileMenuOverlay = styled.div`
  display: ${({ isOpen }) => (isOpen ? 'block' : 'none')};
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 940;
  @media (min-width: 769px) { display: none; }
`;

export const MobileMenuWrapper = styled.div`
  display: flex; flex-direction: column; justify-content: center; align-items: center;
  gap: 10px; background: #6d28d9; position: fixed;
  top: 0; left: ${({ isOpen }) => (isOpen ? '0' : '-100%')};
  height: 100vh; width: 85%; max-width: 320px;
  transition: left 0.3s ease-in-out; z-index: 950;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.3);
  padding-top: 60px; // Espaço para não ficar colado no topo
  overflow-y: auto; 
  @media (min-width: 769px) { display: none; }
`;