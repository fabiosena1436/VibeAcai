// src/App.js

import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import GlobalStyles from './styles/GlobalStyles';
import AppRoutes from './routes';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { StoreSettingsProvider } from './contexts/StoreSettingsContext';
import { Toaster } from 'react-hot-toast'; // --- MUDANÇA: Importar o Toaster ---

function App() {
  return (
    <Router>
      <StoreSettingsProvider>
        <AuthProvider>
          <CartProvider>
            <GlobalStyles />
            <Toaster position="top-right" />
            <AppRoutes />
          </CartProvider>
        </AuthProvider>
      </StoreSettingsProvider>
    </Router>
  );
}

export default App;