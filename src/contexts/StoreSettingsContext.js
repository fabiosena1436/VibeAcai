// src/contexts/StoreSettingsContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../services/firebaseConfig';
import { doc, onSnapshot } from 'firebase/firestore';
import { STORE_SETTINGS_DOC_ID } from '../constants'; // <-- IMPORTANDO A CONSTANTE

const StoreSettingsContext = createContext();

export const useStoreSettings = () => useContext(StoreSettingsContext);

export const StoreSettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    isStoreOpen: false,
    message: '',
    deliveryFee: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const settingsDocRef = doc(db, 'storeSettings', STORE_SETTINGS_DOC_ID);

    const unsubscribe = onSnapshot(settingsDocRef, (doc) => {
      if (doc.exists()) {
        setSettings(doc.data());
      } else {
        console.log("Documento de configurações não encontrado!");
      }
      setLoading(false);
    }, (error) => {
      console.error("Erro ao buscar configurações em tempo real:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <StoreSettingsContext.Provider value={{ settings, loading }}>
      {children}
    </StoreSettingsContext.Provider>
  );
};