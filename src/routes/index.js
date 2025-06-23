// src/routes/index.js

import React from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import styled from 'styled-components';

// Importações das Páginas Públicas e de Login
import HomePage from '../pages/HomePage';
import MenuPage from '../pages/MenuPage';
import CartPage from '../pages/CartPage';
import CheckoutPage from '../pages/CheckoutPage';
import AdminLoginPage from '../pages/AdminLoginPage';

// Importações do Layout e Páginas do Admin
import AdminLayout from '../pages/Admin/AdminLayout';
import DashboardOverviewPage from '../pages/Admin/DashboardOverviewPage';
import ProductsPage from '../pages/Admin/ProductsPage';
import CategoriesPage from '../pages/Admin/CategoriesPage';
import ToppingsPage from '../pages/Admin/ToppingsPage';
import SettingsPage from '../pages/Admin/SettingsPage';
import PromotionsPage from '../pages/Admin/PromotionsPage';
import SizesPage from '../pages/Admin/SizesPage';
// --- NOVO ---
import PrintableReceiptPage from '../pages/Admin/PrintableReceiptPage'; // Importa a nova página de recibo

// Importações de Componentes de Layout e Proteção
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProtectedRoute from '../components/ProtectedRoute';

// Componente de Layout para as páginas públicas
const ContentWrapper = styled.main`
  flex-grow: 1; 
  padding-top: 70px; // Altura da Navbar para evitar sobreposição

  @media (max-width: 768px) {
    padding-top: 60px;
  }
`;

const PublicLayout = () => {
  return (
    <>
      <Navbar />
      <ContentWrapper>
        <Outlet />
      </ContentWrapper>
      <Footer />
    </>
  );
};

// Componente principal que define todas as rotas do app
const AppRoutes = () => {
  return (
    <Routes>
      {/* Rotas públicas agrupadas sob o PublicLayout */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
      </Route>

      {/* Rota de Login do Admin (sem Navbar ou Footer) */}
      <Route path="/admin/login" element={<AdminLoginPage />} />

      {/* --- NOVO --- Rota de impressão fora do layout principal do admin para uma impressão limpa */}
      <Route 
        path="/admin/print/order/:orderId"
        element={
          <ProtectedRoute>
            <PrintableReceiptPage />
          </ProtectedRoute>
        }
      />

      {/* Rotas Protegidas do Admin (usam seu próprio layout, o AdminLayout) */}
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardOverviewPage />} />
        <Route path="dashboard" element={<DashboardOverviewPage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="categories" element={<CategoriesPage />} />
        <Route path="toppings" element={<ToppingsPage />} />
        <Route path="promotions" element={<PromotionsPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="sizes" element={<SizesPage />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;