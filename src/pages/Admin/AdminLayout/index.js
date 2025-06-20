// src/pages/Admin/AdminLayout/index.js

import React, { useState, useEffect, useRef } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { auth, db } from '../../../services/firebaseConfig';
import { signOut } from 'firebase/auth';
import Button from '../../../components/Button';
import { FaBars, FaTimes, FaHome, FaBell } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

import {
  AdminWrapper,
  Sidebar,
  SidebarTitle,
  NavList,
  StyledNavLink,
  ContentArea,
  MenuButton,
  Overlay,
  NavSeparator,
  NotificationBellWrapper,
  NotificationBadge,
} from './styles';

const AdminLayout = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const isInitialLoad = useRef(true);

  useEffect(() => {
    const ordersQuery = query(
      collection(db, "orders"), 
      where("status", "==", "Pendente")
    );

    const unsubscribe = onSnapshot(ordersQuery, (snapshot) => {
      // --- MUDANÇA PRINCIPAL: O contador agora reflete o número total de documentos ---
      // A propriedade 'snapshot.size' nos dá o número exato de pedidos pendentes.
      // A interface sempre mostrará a contagem real, atualizada automaticamente.
      setNotificationCount(snapshot.size);

      // A lógica abaixo continua a mesma, para garantir que o SOM e o POP-UP
      // apareçam apenas para pedidos NOVOS, e não na carga inicial da página.
      if (isInitialLoad.current) {
        isInitialLoad.current = false;
        return;
      }

      snapshot.docChanges().forEach((change) => {
        // Quando um novo pedido é adicionado, tocamos o alerta.
        // Quando um pedido muda de status (sai de "Pendente"), ele é "removido"
        // desta query, e o 'snapshot.size' lá em cima já cuida de atualizar o contador.
        if (change.type === "added") {
          const newOrder = change.doc.data();
          
          const audio = new Audio('/notification.mp3');
          audio.play().catch(error => {
            console.warn("Não foi possível tocar o som de notificação automaticamente:", error);
          });
          
          toast.custom((t) => (
            <div
              style={{
                backgroundColor: '#16a34a',
                color: 'white',
                padding: '16px',
                borderRadius: '8px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                opacity: t.visible ? 1 : 0,
                transition: 'opacity 300ms',
              }}
            >
              <h4 style={{ margin: '0 0 5px 0' }}>🎉 Novo Pedido Recebido!</h4>
              <p style={{ margin: 0 }}>
                Cliente: <strong>{newOrder.customerName}</strong>
              </p>
            </div>
          ), { duration: 6000 });
        }
      });
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/admin/login');
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  // --- MUDANÇA: O clique no sino agora é apenas um atalho ---
  // Removemos a linha que zerava o contador.
  const handleBellClick = () => {
    closeSidebar();
    navigate('/admin/dashboard');
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
          {/* --- MUDANÇA: O link da dashboard também zera o contador ao ser clicado --- */}
          {/* Adicionamos um onClick aqui para uma melhor experiência do usuário */}
          <li onClick={handleBellClick}>
            <StyledNavLink to="/admin/dashboard">
              Visão Geral & Pedidos
              {/* O contador também pode aparecer aqui no menu! */}
              {notificationCount > 0 && (
                <span style={{
                  marginLeft: 'auto',
                  background: '#e53e3e',
                  borderRadius: '10px',
                  padding: '2px 8px',
                  fontSize: '12px'
                }}>
                  {notificationCount}
                </span>
              )}
            </StyledNavLink>
          </li>
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
      
      {/* A lógica do sino continua a mesma, mas agora depende do contador real */}
      <NotificationBellWrapper onClick={handleBellClick}>
        <FaBell />
        {notificationCount > 0 && (
          <NotificationBadge>{notificationCount}</NotificationBadge>
        )}
      </NotificationBellWrapper>

      <Overlay show={isSidebarOpen} onClick={toggleSidebar} />
    </AdminWrapper>
  );
};

export default AdminLayout;