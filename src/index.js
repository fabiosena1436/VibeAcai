// src/index.js

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// --- INÍCIO DO CÓDIGO PARA IGNORAR O ERRO ---
// Este código deteta o erro específico do ResizeObserver e impede que ele apareça na consola.
const originalError = console.error;
console.error = (...args) => {
  if (
    args[0] &&
    typeof args[0] === 'string' &&
    args[0].includes('ResizeObserver loop completed with undelivered notifications')
  ) {
    // Ignora o erro benigno
    return;
  }
  // Para todos os outros erros, mantém o comportamento padrão
  originalError(...args);
};
// --- FIM DO CÓDIGO PARA IGNORAR O ERRO ---

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();