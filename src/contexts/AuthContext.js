// src/contexts/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../services/firebaseConfig'; // Nossa instância de auth do Firebase
import { onAuthStateChanged } from 'firebase/auth'; // Observador do estado de autenticação

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loadingAuthState, setLoadingAuthState] = useState(true); // Para saber quando o estado inicial foi carregado

  useEffect(() => {
    // onAuthStateChanged é um observador que notifica sobre mudanças no estado de login do usuário
    // Ele roda uma vez quando se inscreve e depois toda vez que o estado de auth muda.
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user); // user será o objeto do usuário se logado, ou null se deslogado
      setLoadingAuthState(false); // Marca que o estado inicial de auth foi verificado
      console.log('Auth state changed. Current user:', user ? user.email : null);
    });

    // Função de limpeza: desinscreve o observador quando o componente AuthProvider for desmontado
    return unsubscribe;
  }, []); // O array vazio [] garante que este efeito rode apenas uma vez (na montagem)

  const contextValue = {
    currentUser,
    loadingAuthState
  };

  // Não renderiza os children até que o estado inicial de autenticação seja carregado
  // Isso previne "flashes" de conteúdo protegido ou redirecionamentos incorretos
  if (loadingAuthState) {
    return <p style={{textAlign: 'center', marginTop: '50px', fontSize: '1.2em'}}>Verificando autenticação...</p>; // Ou um spinner/loading component
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};