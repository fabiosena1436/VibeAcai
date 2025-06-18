import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../services/firebaseConfig';
import { doc, onSnapshot } from 'firebase/firestore';

// Assumindo que seu arquivo de constantes exporta o ID do documento
// Se o nome do seu documento for "mainConfig" (como no arquivo de SettingsPage),
// a constante deve ter esse valor.
const STORE_SETTINGS_DOC_ID = "mainConfig"; 

const StoreSettingsContext = createContext();

export const useStoreSettings = () => useContext(StoreSettingsContext);

export const StoreSettingsProvider = ({ children }) => {
  // --- INÍCIO: ESTADO INICIAL ATUALIZADO ---
  // Adicionamos todos os campos que existem na sua página de configurações
  // para que o app não quebre ao tentar acessá-los antes de serem carregados.
  const [settings, setSettings] = useState({
    isStoreOpen: false,
    deliveryFee: 0,
    openingHoursText: '',
    logoUrl: '',
    bannerUrl: '',
    pixKey: '',
    // Nossos novos campos:
    whatsapp: '',
    instagram: '',
    address: '',
  });
  // --- FIM: ESTADO INICIAL ATUALIZADO ---

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const settingsDocRef = doc(db, 'storeSettings', STORE_SETTINGS_DOC_ID);

    const unsubscribe = onSnapshot(settingsDocRef, (doc) => {
      if (doc.exists()) {
        // --- INÍCIO: LÓGICA DE ATUALIZAÇÃO MAIS ROBUSTA ---
        // Pegamos os dados do banco
        const data = doc.data();
        // Atualizamos o estado, garantindo que todos os campos do estado
        // inicial sejam mantidos, mesmo que não venham do banco.
        setSettings(prevSettings => ({
          ...prevSettings, // Mantém a estrutura padrão
          ...data,         // Sobrescreve com os dados do Firebase
        }));
        // --- FIM: LÓGICA DE ATUALIZAÇÃO MAIS ROBUSTA ---
      } else {
        console.log("Documento de configurações não encontrado! Usando valores padrão.");
      }
      setLoading(false);
    }, (error) => {
      console.error("Erro ao buscar configurações em tempo real:", error);
      setLoading(false);
    });

    // Função de limpeza que é executada quando o componente é desmontado
    return () => unsubscribe();
  }, []); // O array vazio garante que o useEffect execute apenas uma vez (na montagem)

  return (
    <StoreSettingsContext.Provider value={{ settings, loading }}>
      {children}
    </StoreSettingsContext.Provider>
  );
};