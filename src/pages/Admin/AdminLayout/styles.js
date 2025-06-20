// src/pages/Admin/AdminLayout/styles.js

import styled from 'styled-components';
import { NavLink } from 'react-router-dom';

// ... (o restante do código de estilos permanece o mesmo)
export const AdminWrapper = styled.div`
  display: flex;
  height: 100vh;
  overflow: hidden; /* Prevenir scroll no wrapper principal */
`;

export const Sidebar = styled.aside`
  min-width: 250px;
  background-color: #1a202c; /* Um tom de cinza escuro, quase preto */
  color: white;
  display: flex;
  flex-direction: column;
  padding: 20px;
  transition: transform 0.3s ease-in-out;

  @media (max-width: 768px) {
    position: fixed;
    height: 100%;
    transform: ${({ isOpen }) => (isOpen ? 'translateX(0)' : 'translateX(-100%)')};
    z-index: 1000;
  }
`;

export const SidebarTitle = styled.h1`
  font-size: 1.8em;
  font-weight: bold;
  color: #8b5cf6; /* Roxo vibrante */
  text-align: center;
  margin-bottom: 30px;
`;

export const NavList = styled.ul`
  list-style: none;
  padding: 0;
  flex-grow: 1;
`;

export const StyledNavLink = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 10px;
  color: #cbd5e1; /* Cinza claro */
  text-decoration: none;
  padding: 12px 15px;
  margin-bottom: 8px;
  border-radius: 8px;
  transition: background-color 0.2s, color 0.2s;

  &:hover {
    background-color: #2d3748; /* Cinza um pouco mais claro */
    color: white;
  }

  &.active {
    background-color: #8b5cf6;
    color: white;
    font-weight: bold;
  }
`;

export const NavSeparator = styled.hr`
  border: none;
  border-top: 1px solid #4a5568;
  margin: 20px 0;
`;

export const ContentArea = styled.main`
  flex-grow: 1;
  padding: 25px;
  background-color: #f7fafc; /* Um fundo bem claro */
  overflow-y: auto; /* Permite scroll apenas na área de conteúdo */
`;

export const MenuButton = styled.button`
  display: none; // Escondido por padrão
  @media (max-width: 768px) {
    display: block;
    position: fixed;
    top: 15px;
    left: 15px;
    background: #8b5cf6;
    color: white;
    border: none;
    padding: 10px;
    border-radius: 50%;
    cursor: pointer;
    z-index: 1002;
    font-size: 20px;
    line-height: 1;
  }
`;

export const Overlay = styled.div`
  display: none;
  @media (max-width: 768px) {
    display: ${({ show }) => (show ? 'block' : 'none')};
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 999;
  }
`;

// --- NOVO: Estilos para o sino de notificação ---
export const NotificationBellWrapper = styled.button`
  display: none; // Escondido por padrão, para aparecer só no mobile
  
  @media (max-width: 768px) {
    display: block;
    position: fixed;
    top: 15px;
    right: 15px; /* Alinhado à direita */
    background: none;
    border: none;
    color: #8b5cf6; /* Cor roxa, para combinar */
    font-size: 24px; /* Tamanho do ícone */
    cursor: pointer;
    z-index: 1002;
    padding: 10px;
  }
`;

export const NotificationBadge = styled.span`
  position: absolute;
  top: 5px;
  right: 5px;
  background-color: #e53e3e; // Vermelho
  color: white;
  border-radius: 50%;
  padding: 2px 6px;
  font-size: 10px;
  font-weight: bold;
  line-height: 1;
  border: 2px solid white;
`;