// src/components/ConfirmationModal/index.js
import React from 'react';
import Button from '../Button';
import Modal from '../Modal'; // Importa nosso novo Modal genérico
import styled from 'styled-components';

// Estilos específicos para a mensagem e ações deste modal
const Message = styled.p`
  font-size: 1.1em;
  color: #555;
  line-height: 1.5;
  text-align: center;
`;

const Actions = styled.div`
  display: flex;
  justify-content: center;
  gap: 15px;
`;

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  const footerContent = (
    <Actions>
      {/* Aqui está a mudança!
        - Usamos a variante 'secondary' para o botão de cancelar.
        - Usamos a variante 'danger' para o botão de confirmar.
        - Removemos a prop 'style' que continha cores hardcoded.
      */}
      <Button onClick={onClose} variant="secondary">
        Cancelar
      </Button>
      <Button onClick={onConfirm} variant="danger">
        Confirmar
      </Button>
    </Actions>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title || 'Confirmar Ação'}
      footer={footerContent}
    >
      <Message>{message || 'Você tem certeza?'}</Message>
    </Modal>
  );
};

export default ConfirmationModal;