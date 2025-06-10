// src/components/StoreStatusBanner/index.js
import React from 'react';
import styled from 'styled-components';
import { useStoreSettings } from '../../contexts/StoreSettingsContext';

const BannerWrapper = styled.div`
  background-color: #ef4444; /* Vermelho */
  color: white;
  text-align: center;
  padding: 12px;
  font-weight: 600;
  font-size: 0.95em;
  position: fixed;
  top: 70px; /* Abaixo da Navbar */
  width: 100%;
  z-index: 899; /* Um pouco abaixo da Navbar */
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
`;

const StoreStatusBanner = () => {
  const { settings, loading } = useStoreSettings();

  if (loading || settings.isStoreOpen) {
    return null; // Não mostra nada se a loja estiver aberta ou carregando
  }

  return (
    <BannerWrapper>
      Estamos fechados no momento. Pedidos online estão desativados.
      {settings.openingHoursText && ` Nosso horário: ${settings.openingHoursText}`}
    </BannerWrapper>
  );
};
export default StoreStatusBanner;