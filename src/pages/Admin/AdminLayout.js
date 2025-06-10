// src/pages/Admin/AdminLayout.js
import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { auth } from '../../services/firebaseConfig';
import { signOut } from 'firebase/auth';
import Button from '../../components/Button';
import { FaBars, FaTimes } from 'react-icons/fa'; // Ícones para o menu

// --- COMPONENTES ESTILIZADOS COM RESPONSIVIDADE ---

const AdminWrapper = styled.div`
  display: flex;
  position: relative; /* Necessário para posicionar a sidebar em telas pequenas */
  min-height: calc(100vh - 70px); // Subtrai a altura da Navbar principal
`;

const Sidebar = styled.div`
  width: 240px;
  background-color: #4a044e; // Roxo escuro
  color: #e0d6ff;
  padding: 20px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  transition: transform 0.3s ease-in-out;
  z-index: 1000; // Garante que a sidebar fique sobre o conteúdo

  /* Estilos para telas pequenas (mobile) */
  @media (max-width: 768px) {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    height: 100vh;
    transform: ${props => props.isOpen ? 'translateX(0)' : 'translateX(-100%)'};
  }
`;

const SidebarTitle = styled.h2`
  color: #fff;
  text-align: center;
  margin-top: 0;
  margin-bottom: 30px;
  font-size: 1.4em;
`;

const NavList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  flex-grow: 1;
`;

const StyledNavLink = styled(NavLink)`
  display: block;
  color: #e0d6ff;
  text-decoration: none;
  padding: 12px 15px;
  border-radius: 6px;
  margin-bottom: 8px;
  transition: background-color 0.2s;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }

  &.active {
    background-color: #7c3aed;
    color: #fff;
    font-weight: bold;
  }
`;

const ContentArea = styled.main`
  flex-grow: 1;
  padding: 30px;
  background-color: #f8fafc;
  width: 100%;

  @media (max-width: 768px) {
    padding: 15px;
  }
`;

const MenuButton = styled.button`
  display: none; /* Escondido por padrão em telas grandes */
  background: none;
  border: none;
  cursor: pointer;
  z-index: 1100; // Fica acima de tudo
  
  @media (max-width: 768px) {
    display: block; /* Visível apenas em telas pequenas */
    position: fixed;
    top: 80px;
    right: 15px;
    background-color: #7c3aed;
    color: white;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    font-size: 20px;
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
  }
`;

const Overlay = styled.div`
  display: none; /* Escondido por padrão */
  @media (max-width: 768px) {
    display: ${props => props.show ? 'block' : 'none'};
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 999; /* Fica entre a sidebar e o conteúdo */
  }
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

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };
  
  const closeSidebar = () => {
    setSidebarOpen(false);
  }

  return (
    <AdminWrapper>
      <Sidebar isOpen={isSidebarOpen}>
        <SidebarTitle>Vibe Açaí ADM</SidebarTitle>
        <NavList>
          {/* Ao clicar em um link, a sidebar fecha */}
          <li><StyledNavLink to="/admin/dashboard" onClick={closeSidebar}>Visão Geral & Pedidos</StyledNavLink></li>
          <li><StyledNavLink to="/admin/products" onClick={closeSidebar}>Produtos</StyledNavLink></li>
          <li><StyledNavLink to="/admin/categories" onClick={closeSidebar}>Categorias</StyledNavLink></li>
          <li><StyledNavLink to="/admin/toppings" onClick={closeSidebar}>Adicionais</StyledNavLink></li>
          <li><StyledNavLink to="/admin/promotions" onClick={closeSidebar}>Promoções</StyledNavLink></li>
          <li><StyledNavLink to="/admin/settings" onClick={closeSidebar}>Configurações</StyledNavLink></li>
        </NavList>
        <Button onClick={handleLogout} style={{backgroundColor: '#ef4444'}}>Sair (Logout)</Button>
      </Sidebar>

      <ContentArea>
        <Outlet /> {/* As páginas específicas do admin aparecerão aqui */}
      </ContentArea>

      {/* Botão de Menu e Overlay só aparecem em telas menores */}
      <MenuButton onClick={toggleSidebar}>
        {isSidebarOpen ? <FaTimes /> : <FaBars />}
      </MenuButton>
      <Overlay show={isSidebarOpen} onClick={toggleSidebar} />
    </AdminWrapper>
  );
};

export default AdminLayout;