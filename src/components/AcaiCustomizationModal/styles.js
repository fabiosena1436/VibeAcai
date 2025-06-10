// src/components/AcaiCustomizationModal/styles.js
import styled from 'styled-components';

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000; // Para ficar sobre outros elementos
`;

export const ModalContent = styled.div`
  background-color: #fff;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  width: 90%;
  max-width: 500px; // Largura máxima do modal
  max-height: 80vh; // Altura máxima
  overflow-y: auto; // Barra de rolagem se o conteúdo for grande
  position: relative;
`;

export const ModalHeader = styled.h2`
  color: #7c3aed;
  margin-top: 0;
  margin-bottom: 20px;
  text-align: center;
`;

export const ModalCloseButton = styled.button`
  position: absolute;
  top: 15px;
  right: 15px;
  background: transparent;
  border: none;
  font-size: 1.8em;
  cursor: pointer;
  color: #888;
  &:hover {
    color: #333;
  }
`;

export const OptionsSection = styled.div`
  margin-bottom: 20px;
  // Estilos para seções de opções (tamanho, adicionais) virão aqui
`;

export const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 30px;
  border-top: 1px solid #eee;
  padding-top: 20px;
`;