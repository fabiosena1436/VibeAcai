// src/pages/Admin/AdminLayout.js

import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { auth } from '../../services/firebaseConfig';
import { signOut } from 'firebase/auth';
import Button from '../../components/Button';
// MUDANÇA: Adicionamos o ícone de "Home"
import { FaBars, FaTimes, FaHome } from 'react-icons/fa';

// --- STYLED COMPONENTS (com uma pequena adição) ---
const AdminWrapper = styled.div` display: flex; position: relative; min-height: 100vh; `;
const Sidebar = styled.div` width: 240px; background-color: #4a044e; color: #e0d6ff; padding: 20px; flex-shrink: 0; display: flex; flex-direction: column; transition: transform 0.3s ease-in-out; z-index: 1000; @media (max-width: 768px) { position: fixed; left: 0; top: 0; bottom: 0; height: 100vh; transform: ${props => props.isOpen ? 'translateX(0)' : 'translateX(-100%)'}; } `;
const SidebarTitle = styled.h2` color: #fff; text-align: center; margin-top: 0; margin-bottom: 30px; font-size: 1.4em; `;
const NavList = styled.ul` list-style: none; padding: 0; margin: 0; flex-grow: 1; `;

// MUDANÇA: Adicionamos um ícone ao link
const StyledNavLink = styled(NavLink)` 
  display: flex; // Alterado para flex para alinhar ícone e texto
  align-items: center;
  gap: 10px; // Espaço entre ícone e texto
  color: #e0d6ff; text-decoration: none; padding: 12px 15px; border-radius: 6px; margin-bottom: 8px; transition: background-color 0.2s; 
  &:hover { background-color: rgba(255, 255, 255, 0.1); } 
  &.active { background-color: #7c3aed; color: #fff; font-weight: bold; } 
`;
const ContentArea = styled.main` flex-grow: 1; padding: 30px; background-color: #f8fafc; width: 100%; @media (max-width: 768px) { padding: 15px; } `;
// MUDANÇA: Posição do botão de menu ajustada para não sobrepor a navbar (que foi removida, mas é uma boa prática)
const MenuButton = styled.button` 
  display: none; background: none; border: none; cursor: pointer; z-index: 1100; 
  @media (max-width: 768px) { 
    display: block; position: fixed; top: 15px; right: 15px; 
    background-color: #7c3aed; color: white; border-radius: 50%; width: 50px; height: 50px; 
    font-size: 20px; box-shadow: 0 4px 8px rgba(0,0,0,0.2); 
  } 
`;
const Overlay = styled.div` display: none; @media (max-width: 768px) { display: ${props => props.show ? 'block' : 'none'}; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); z-index: 999; } `;
// MUDANÇA: Estilo para o separador na lista
const NavSeparator = styled.hr`
  border: none;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  margin: 15px 0;
`;

const AdminLayout = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/admin/login');
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <AdminWrapper>
      <Sidebar isOpen={isSidebarOpen}>
        <SidebarTitle>Vibe Açaí ADM</SidebarTitle>
        <NavList>
          {/* MUDANÇA: Link para voltar ao site adicionado no topo */}
          <li onClick={closeSidebar}>
            <StyledNavLink to="/">
              <FaHome /> Voltar para o Site
            </StyledNavLink>
          </li>

          <NavSeparator /> 

          <li onClick={closeSidebar}><StyledNavLink to="/admin/dashboard">Visão Geral & Pedidos</StyledNavLink></li>
          <li onClick={closeSidebar}><StyledNavLink to="/admin/products">Produtos</StyledNavLink></li>
          <li onClick={closeSidebar}><StyledNavLink to="/admin/categories">Categorias</StyledNavLink></li>
          <li onClick={closeSidebar}><StyledNavLink to="/admin/toppings">Adicionais</StyledNavLink></li>
          <li onClick={closeSidebar}><StyledNavLink to="/admin/sizes">Tamanhos</StyledNavLink></li>
          <li onClick={closeSidebar}><StyledNavLink to="/admin/promotions">Promoções</StyledNavLink></li>
          <li onClick={closeSidebar}><StyledNavLink to="/admin/settings">Configurações</StyledNavLink></li>
        </NavList>
        <Button onClick={handleLogout} variant="danger">Sair (Logout)</Button>
      </Sidebar>

      <ContentArea>
        <Outlet />
      </ContentArea>

      <MenuButton onClick={toggleSidebar}>
        {isSidebarOpen ? <FaTimes /> : <FaBars />}
      </MenuButton>
      <Overlay show={isSidebarOpen} onClick={toggleSidebar} />
    </AdminWrapper>
  );
};

export default AdminLayout;