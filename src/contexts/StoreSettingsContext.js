// src/contexts/StoreSettingsContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../services/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

const StoreSettingsContext = createContext();

const STORE_SETTINGS_DOC_ID = "mainConfig";

export const StoreSettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    isStoreOpen: true,
    openingHoursText: '',
    deliveryFee: 0,
    pixKey: '',
    logoUrl: '',
    bannerUrl: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const settingsDocRef = doc(db, 'storeSettings', STORE_SETTINGS_DOC_ID);
        const docSnap = await getDoc(settingsDocRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setSettings({
            isStoreOpen: data.isStoreOpen !== undefined ? data.isStoreOpen : true,
            openingHoursText: data.openingHoursText || '',
            deliveryFee: data.deliveryFee || 0,
            pixKey: data.pixKey || '',
            logoUrl: data.logoUrl || '',
            bannerUrl: data.bannerUrl || '',
          });
        }
      } catch (error) {
        console.error("Erro ao carregar configurações da loja:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  return (
    <StoreSettingsContext.Provider value={{ settings, loading }}>
      {children}
    </StoreSettingsContext.Provider>
  );
};

export const useStoreSettings = () => {
  return useContext(StoreSettingsContext);
};