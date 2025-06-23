import React from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import styled from 'styled-components';
import HomePage from '../pages/HomePage';
import MenuPage from '../pages/MenuPage';
import CartPage from '../pages/CartPage';
import CheckoutPage from '../pages/CheckoutPage';
import AdminLoginPage from '../pages/AdminLoginPage';
// --- NOVO --- Importa a nova página de detalhes
import ProductDetailPage from '../pages/ProductDetailPage'; 
import AdminLayout from '../pages/Admin/AdminLayout';
import DashboardOverviewPage from '../pages/Admin/DashboardOverviewPage';
import ProductsPage from '../pages/Admin/ProductsPage';
import CategoriesPage from '../pages/Admin/CategoriesPage';
import ToppingsPage from '../pages/Admin/ToppingsPage';
import SettingsPage from '../pages/Admin/SettingsPage';
import PromotionsPage from '../pages/Admin/PromotionsPage';
import SizesPage from '../pages/Admin/SizesPage';
import PrintableReceiptPage from '../pages/Admin/PrintableReceiptPage';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProtectedRoute from '../components/ProtectedRoute';

const ContentWrapper = styled.main`
  flex-grow: 1; 
  padding-top: 70px;

  @media (max-width: 768px) {
    padding-top: 60px;
  }
`;

const PublicLayout = () => (
  <>
    <Navbar />
    <ContentWrapper>
      <Outlet />
    </ContentWrapper>
    <Footer />
  </>
);

const AppRoutes = () => (
  <Routes>
    <Route element={<PublicLayout />}>
      <Route path="/" element={<HomePage />} />
      <Route path="/menu" element={<MenuPage />} />
      {/* --- NOVO --- Rota para a página de detalhes do produto */}
      <Route path="/produto/:productId" element={<ProductDetailPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
    </Route>

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
      <Route path="sizes" element={<SizesPage />} />
    </Route>
  </Routes>
);

export default AppRoutes;