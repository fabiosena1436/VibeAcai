// src/components/ProtectedRoute/index.js
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext'; // Nosso hook de autenticação

const ProtectedRoute = ({ children }) => {
  const { currentUser, loadingAuthState } = useAuth();
  const location = useLocation(); // Para saber de qual página o usuário veio (opcional)

  if (loadingAuthState) {
    // Enquanto o estado de autenticação está carregando, mostramos uma mensagem.
    // Isso evita redirecionamentos prematuros antes do Firebase verificar a sessão.
    return <p style={{textAlign: 'center', marginTop: '50px', fontSize: '1.2em'}}>Verificando autenticação...</p>;
  }
  

  if (!currentUser) {
    // Se não houver usuário logado (e o carregamento terminou),
    // redireciona para a página de login do admin.
    // Passamos a localização atual para que possamos redirecionar de volta após o login (opcional).
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // Se houver um usuário logado, renderiza o componente filho (a página protegida).
  return children;
};

export default ProtectedRoute;