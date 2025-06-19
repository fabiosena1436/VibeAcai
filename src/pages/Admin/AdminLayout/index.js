// src/pages/Admin/AdminLayout/index.js
import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { auth } from '../../../services/firebaseConfig'; // <-- Caminho atualizado
import { signOut } from 'firebase/auth';
import Button from '../../../components/Button'; // <-- Caminho atualizado
import { FaBars, FaTimes } from 'react-icons/fa';
import { 
  AdminWrapper, 
  Sidebar, 
  SidebarTitle, 
  NavList, 
  StyledNavLink, 
  ContentArea, 
  MenuButton, 
  Overlay 
} from './styles'; // <-- Importação local

const AdminLayout = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setSidebarOpen] = React.useState(false);

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
          <li onClick={closeSidebar}><StyledNavLink to="/admin/dashboard">Visão Geral & Pedidos</StyledNavLink></li>
          <li onClick={closeSidebar}><StyledNavLink to="/admin/products">Produtos</StyledNavLink></li>
          <li onClick={closeSidebar}><StyledNavLink to="/admin/categories">Categorias</StyledNavLink></li>
          <li onClick={closeSidebar}><StyledNavLink to="/admin/toppings">Adicionais</StyledNavLink></li>
          <li onClick={closeSidebar}><StyledNavLink to="/admin/sizes">Tamanhos dos copos</StyledNavLink></li>
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