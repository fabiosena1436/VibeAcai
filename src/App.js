// src/App.js

import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import styled from 'styled-components';

// Importação dos Contextos (Providers)
import { CartProvider } from './contexts/CartContext';
import { AuthProvider } from './contexts/AuthContext';
import { StoreSettingsProvider } from './contexts/StoreSettingsContext';

// Importação dos Estilos Globais e do novo Componente de Rotas
import GlobalStyles from './styles/GlobalStyles';
import AppRoutes from './routes'; // Importa o nosso novo arquivo de rotas!

// O AppWrapper continua aqui, pois ele envolve toda a aplicação.
const AppWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

function App() {
  return (
    <AuthProvider>
      <StoreSettingsProvider>
        <CartProvider>
          <Router>
            <GlobalStyles />
            <AppWrapper>
              <AppRoutes /> {/* O único componente renderizado aqui são as rotas */}
            </AppWrapper>
          </Router>
        </CartProvider>
      </StoreSettingsProvider>
    </AuthProvider>
  );
}

export default App;