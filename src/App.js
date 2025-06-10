// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Importações das Páginas Públicas e de Login
import HomePage from './pages/HomePage';
import MenuPage from './pages/MenuPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import AdminLoginPage from './pages/AdminLoginPage';

// Importações do Layout e Páginas do Admin
import AdminLayout from './pages/Admin/AdminLayout';
import DashboardOverviewPage from './pages/Admin/DashboardOverviewPage';
import ProductsPage from './pages/Admin/ProductsPage';
import CategoriesPage from './pages/Admin/CategoriesPage';
import ToppingsPage from './pages/Admin/ToppingsPage';
import SettingsPage from './pages/Admin/SettingsPage'; // Importação da página de configurações
import PromotionsPage from './pages/Admin/PromotionsPage'

// Importações de Componentes e Contextos
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import styled, { createGlobalStyle } from 'styled-components';
import { CartProvider } from './contexts/CartContext';
import { AuthProvider } from './contexts/AuthContext';
import { StoreSettingsProvider } from './contexts/StoreSettingsContext';
import StoreStatusBanner from './components/StoreStatusBanner';

const GlobalStyle = createGlobalStyle`/* ... (Seus estilos globais aqui) ... */`;
const AppWrapper = styled.div``;

function App() {
  return (
    <AuthProvider>
      <StoreSettingsProvider>
        <CartProvider>
          <Router>
            <GlobalStyle />
            <StoreStatusBanner />
            <Navbar />
            <AppWrapper>
              <Routes>
                {/* Rotas Públicas */}
                <Route path="/" element={<HomePage />} />
                <Route path="/menu" element={<MenuPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/admin/login" element={<AdminLoginPage />} />

                {/* ROTAS PROTEGIDAS DO ADMIN */}
                <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
                  <Route index element={<DashboardOverviewPage />} />
                  <Route path="dashboard" element={<DashboardOverviewPage />} />
                  <Route path="products" element={<ProductsPage />} />
                  <Route path="categories" element={<CategoriesPage />} />
                  <Route path="toppings" element={<ToppingsPage />} />
                  <Route path="promotions" element={<PromotionsPage />} />
                  {/* CORREÇÃO AQUI: */}
                  <Route path="settings" element={<SettingsPage />} />
                </Route>
              </Routes>
            </AppWrapper>
          </Router>
        </CartProvider>
      </StoreSettingsProvider>
    </AuthProvider>
  );
}

export default App;