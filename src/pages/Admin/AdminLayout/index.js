// src/pages/Admin/AdminLayout/index.js

import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { auth } from '../../../services/firebaseConfig'; // Ajuste o caminho se necessário
import { signOut } from 'firebase/auth';
import Button from '../../../components/Button'; // Ajuste o caminho se necessário
import { FaBars, FaTimes, FaHome } from 'react-icons/fa';

// Importando todos os componentes estilizados do arquivo de estilos
import {
  AdminWrapper,
  Sidebar,
  SidebarTitle,
  NavList,
  StyledNavLink,
  ContentArea,
  MenuButton,
  Overlay,
  NavSeparator
} from './styles';

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