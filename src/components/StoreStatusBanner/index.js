// src/components/StoreStatusBanner/index.js
import React from 'react';
import { Banner } from './styles'; // Verifique se está a importar "Banner"

const StoreStatusBanner = ({ isOpen }) => {
  return (
    <Banner isOpen={isOpen}>
      {isOpen ? 'Loja Aberta' : 'Loja Fechada'}
    </Banner>
  );
};

export default StoreStatusBanner;