// src/pages/Admin/AdminLayout.js
import React from 'react';
import { Outlet, NavLink } from 'react-router-dom'; // Outlet é onde as páginas aninhadas serão renderizadas
import styled from 'styled-components';
import { auth } from '../../services/firebaseConfig';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button';

const AdminWrapper = styled.div`
  display: flex;
  min-height: calc(100vh - 70px); // Subtrai a altura da Navbar principal
`;

const Sidebar = styled.div`
  width: 240px;
  background-color: #4a044e; // Um roxo mais escuro para a sidebar
  color: #e0d6ff;
  padding: 20px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
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
  flex-grow: 1; // Ocupa o espaço disponível, empurrando o logout para baixo
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

  &.active { // Estilo especial para o link da página ativa
    background-color: #7c3aed;
    color: #fff;
    font-weight: bold;
  }
`;

const ContentArea = styled.main`
  flex-grow: 1;
  padding: 30px;
  background-color: #f8fafc; // Fundo da área de conteúdo
`;

const AdminLayout = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/admin/login');
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  return (
    <AdminWrapper>
      <Sidebar>
        <SidebarTitle>Vibe Açaí ADM</SidebarTitle>
        <NavList>
          <li><StyledNavLink to="/admin/dashboard">Visão Geral & Pedidos</StyledNavLink></li>
          <li><StyledNavLink to="/admin/products">Produtos</StyledNavLink></li>
          <li><StyledNavLink to="/admin/categories">Categorias</StyledNavLink></li>
          <li><StyledNavLink to="/admin/toppings">Adicionais</StyledNavLink></li>
          <li><StyledNavLink to="/admin/promotions">Promoções</StyledNavLink></li>
          <li><StyledNavLink to="/admin/settings">Configurações</StyledNavLink></li>
        </NavList>
        <Button onClick={handleLogout} style={{backgroundColor: '#ef4444'}}>Sair (Logout)</Button>
      </Sidebar>
      <ContentArea>
        <Outlet /> {/* As páginas específicas do admin aparecerão aqui */}
      </ContentArea>
    </AdminWrapper>
  );
};

export default AdminLayout;