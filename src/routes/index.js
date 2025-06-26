import React from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import styled from 'styled-components';

// --- Imports das Páginas e Componentes ---
import HomePage from '../pages/HomePage';
import MenuPage from '../pages/MenuPage';
import CartPage from '../pages/CartPage';
import CheckoutPage from '../pages/CheckoutPage';
import AdminLoginPage from '../pages/AdminLoginPage';
import ProductDetailPage from '../pages/ProductDetailPage'; 
import AdminLayout from '../pages/Admin/AdminLayout';
import DashboardOverviewPage from '../pages/Admin/DashboardOverviewPage';
import ProductsPage from '../pages/Admin/ProductsPage';
import CategoriesPage from '../pages/Admin/CategoriesPage';
import ToppingsPage from '../pages/Admin/ToppingsPage';
import SettingsPage from '../pages/Admin/SettingsPage';
import PromotionsPage from '../pages/Admin/PromotionsPage';
import PrintableReceiptPage from '../pages/Admin/PrintableReceiptPage';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProtectedRoute from '../components/ProtectedRoute';

const ContentWrapper = styled.main`
  flex-grow: 1; 
  padding-top: 70px; /* Altura do Navbar */

  @media (max-width: 768px) {
    padding-top: 60px; /* Altura do Navbar em telas menores */
  }
`;

// Layout para páginas públicas que TÊM rodapé
const LayoutComRodape = () => (
  <>
    <Navbar />
    <ContentWrapper>
      <Outlet />
    </ContentWrapper>
    <Footer />
  </>
);

// Layout para páginas que NÃO TÊM rodapé (como a de detalhes do produto)
const LayoutSemRodape = () => (
    <>
      <Navbar />
      <ContentWrapper>
        <Outlet />
      </ContentWrapper>
    </>
  );

// Componente principal de rotas que será exportado
const AppRoutes = () => (
  <Routes>
    {/* Agrupamos as rotas que usam o layout com rodapé */}
    <Route element={<LayoutComRodape />}>
      <Route path="/" element={<HomePage />} />
      <Route path="/menu" element={<MenuPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
    </Route>

    {/* A rota de detalhes do produto agora usa o layout sem rodapé */}
    <Route element={<LayoutSemRodape />}>
        <Route path="/produto/:productId" element={<ProductDetailPage />} />
    </Route>

    {/* Rotas de Admin */}
    <Route path="/admin/login" element={<AdminLoginPage />} />
    <Route 
      path="/admin/print/order/:orderId"
      element={
        <ProtectedRoute>
          <PrintableReceiptPage />
        </ProtectedRoute>
      }
    />
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
    </Route>
  </Routes>
);

export default AppRoutes;