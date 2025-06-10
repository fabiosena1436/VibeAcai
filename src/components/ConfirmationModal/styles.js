// src/components/ConfirmationModal/styles.js
import styled from 'styled-components';

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1001; /* Z-index alto para ficar sobre tudo */
`;

export const ModalContent = styled.div`
  background-color: #fff;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  width: 90%;
  max-width: 450px;
  text-align: center;
`;

export const ModalTitle = styled.h3`
  margin-top: 0;
  margin-bottom: 15px;
  font-size: 1.5em;
  color: #333;
`;

export const ModalMessage = styled.p`
  margin-bottom: 30px;
  font-size: 1.1em;
  color: #555;
  line-height: 1.5;
`;

export const ModalActions = styled.div`
  display: flex;
  justify-content: center;
  gap: 15px;
`;