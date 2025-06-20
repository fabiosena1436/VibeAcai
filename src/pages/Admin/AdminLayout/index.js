// src/pages/Admin/AdminLayout/index.js

import React, { useState, useEffect, useRef } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { auth, db } from '../../../services/firebaseConfig';
import { signOut } from 'firebase/auth';
import Button from '../../../components/Button';
import { FaBars, FaTimes, FaHome } from 'react-icons/fa';
import toast from 'react-hot-toast'; // Importando o toast para as notificações

// MUDANÇA: Importando funções do Firestore para o listener em tempo real
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
  NavSeparator
} from './styles';

const AdminLayout = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  
  // MUDANÇA: Usamos useRef para evitar a notificação na carga inicial
  const isInitialLoad = useRef(true);

  // --- MUDANÇA: LÓGICA DE NOTIFICAÇÃO DE NOVOS PEDIDOS ---
  useEffect(() => {
    // Cria uma query que busca pedidos com status "Pendente"
    const ordersQuery = query(
      collection(db, "orders"), 
      where("status", "==", "Pendente")
    );

    // Inicia o "listener" em tempo real
    const unsubscribe = onSnapshot(ordersQuery, (snapshot) => {
      // Se for a primeira vez que o listener é ativado (ao carregar a página),
      // apenas marcamos que a carga inicial foi concluída e não fazemos nada.
      if (isInitialLoad.current) {
        isInitialLoad.current = false;
        return;
      }

      // Itera sobre as mudanças que ocorreram na coleção
      snapshot.docChanges().forEach((change) => {
        // Se um novo documento foi ADICIONADO...
        if (change.type === "added") {
          const newOrder = change.doc.data();
          
          // 1. Toca o som de notificação
          // (Certifique-se de que 'notification.mp3' está na pasta /public)
          const audio = new Audio('/notification.mp3');
          audio.play().catch(error => {
            console.warn("Não foi possível tocar o som de notificação automaticamente:", error);
          });
          
          // 2. Mostra uma notificação visual (toast)
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
          ), { duration: 6000 }); // A notificação dura 6 segundos
        }
      });
    });

    // Função de limpeza: O listener é removido quando o componente é desmontado.
    // Isso é MUITO importante para evitar vazamentos de memória.
    return () => unsubscribe();
  }, []); // O array vazio [] garante que este efeito rode apenas uma vez

  // --- O restante do componente permanece igual ---

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