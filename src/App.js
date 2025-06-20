// src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';

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
import SizesPage from './pages/Admin/SizesPage';

// Importações de Componentes e Contextos
import Navbar from './components/Navbar';
import Footer from './components/Footer'; // Importando o Footer
import ProtectedRoute from './components/ProtectedRoute';
import styled from 'styled-components';
import { CartProvider } from './contexts/CartContext';
import { AuthProvider } from './contexts/AuthContext';
import { StoreSettingsProvider } from './contexts/StoreSettingsContext';
import { useStoreSettings } from './contexts/StoreSettingsContext'; // Hook para usar as configurações

// Importação dos estilos globais
import GlobalStyles from './styles/GlobalStyles';

const AppWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  // A remoção de overflow, width e position é importante para evitar conflitos de layout
`;

const ContentWrapper = styled.main`
  flex-grow: 1; 
  padding-top: 70px; // Altura da Navbar para evitar sobreposição

  @media (max-width: 768px) {
    padding-top: 60px;
  }
`;

// MUDANÇA: Componente de Layout para as páginas públicas
// Este componente garante que a Navbar e o Footer apareçam em todas as páginas públicas.
const PublicLayout = () => {
  const { settings } = useStoreSettings();
  return (
    <>
      <Navbar />
      <ContentWrapper>
        <Outlet /> {/* Renderiza o conteúdo da rota filha aqui */}
      </ContentWrapper>
      {/* O Footer agora é parte do layout público */}
      <Footer />
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <StoreSettingsProvider>
        <CartProvider>
          <Router>
            <GlobalStyles />
            <AppWrapper>
              <Routes>
                {/* MUDANÇA: Rotas públicas agrupadas sob o PublicLayout */}
                <Route element={<PublicLayout />}>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/menu" element={<MenuPage />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/checkout" element={<CheckoutPage />} />
                </Route>

                {/* Rota de Login do Admin (sem Navbar ou Footer) */}
                <Route path="/admin/login" element={<AdminLoginPage />} />

                {/* Rotas Protegidas do Admin (usam seu próprio layout, o AdminLayout) */}
                <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
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
            </AppWrapper>
          </Router>
        </CartProvider>
      </StoreSettingsProvider>
    </AuthProvider>
  );
}

export default App;