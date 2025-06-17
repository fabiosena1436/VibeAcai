// src/components/StoreStatusBanner/styles.js
import styled from 'styled-components';

export const Banner = styled.div`
  width: 100%;
  padding: 12px;
  text-align: center;
  font-weight: bold;
  font-size: 16px;

  /* Estilo para loja fechada */
  background-color: ${({ isOpen }) => (isOpen ? '#2ecc71' : '#e74c3c')};
  color: #fff;
`;