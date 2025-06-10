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
import SettingsPage from './pages/Admin/SettingsPage';
import PromotionsPage from './pages/Admin/PromotionsPage';

// Importações de Componentes e Contextos
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import styled from 'styled-components';
import { CartProvider } from './contexts/CartContext';
import { AuthProvider } from './contexts/AuthContext';
import { StoreSettingsProvider } from './contexts/StoreSettingsContext';
import StoreStatusBanner from './components/StoreStatusBanner';

// Importação dos estilos globais
import GlobalStyles from './styles/GlobalStyles';

const AppWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  overflow-x: hidden;
  width: 100%;
  position: relative;
`;

function App() {
  return (
    <AuthProvider>
      <StoreSettingsProvider>
        <CartProvider>
          <Router>
            <GlobalStyles />
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

                {/* Rotas Protegidas do Admin */}
                <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
                  <Route index element={<DashboardOverviewPage />} />
                  <Route path="dashboard" element={<DashboardOverviewPage />} />
                  <Route path="products" element={<ProductsPage />} />
                  <Route path="categories" element={<CategoriesPage />} />
                  <Route path="toppings" element={<ToppingsPage />} />
                  <Route path="promotions" element={<PromotionsPage />} />
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