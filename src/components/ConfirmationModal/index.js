// src/components/ConfirmationModal/index.js
import React from 'react';
import Button from '../Button';
import {
  ModalOverlay,
  ModalContent,
  ModalTitle,
  ModalMessage,
  ModalActions
} from './styles';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <ModalOverlay>
      <ModalContent>
        <ModalTitle>{title || 'Confirmar Ação'}</ModalTitle>
        <ModalMessage>{message || 'Você tem certeza?'}</ModalMessage>
        <ModalActions>
          <Button onClick={onClose} style={{ backgroundColor: '#6b7280' }}>
            Cancelar
          </Button>
          <Button onClick={onConfirm} style={{ backgroundColor: '#dc2626' }}>
            Confirmar Exclusão
          </Button>
        </ModalActions>
      </ModalContent>
    </ModalOverlay>
  );
};

export default ConfirmationModal;