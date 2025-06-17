// src/components/Modal/index.js
import React from 'react';
import {
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalCloseButton, // <-- Corrigido de 'CloseButton' para 'ModalCloseButton'
  ModalBody,
  ModalFooter
} from './styles';

/**
 * Componente de Modal Genérico
 * * @param {object} props
 * @param {boolean} props.isOpen - Controla se o modal está visível ou não.
 * @param {function} props.onClose - Função a ser chamada quando o modal deve ser fechado (pelo botão 'X' ou overlay).
 * @param {string} [props.title] - Título opcional a ser exibido no cabeçalho do modal.
 * @param {React.ReactNode} props.children - Conteúdo a ser renderizado dentro do corpo do modal.
 * @param {React.ReactNode} [props.footer] - Conteúdo opcional para o rodapé, ideal para botões de ação.
 */
const Modal = ({ isOpen, onClose, title, children, footer }) => {
  if (!isOpen) {
    return null;
  }

  // Permite fechar o modal clicando no overlay, mas não no conteúdo.
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <ModalOverlay onClick={handleOverlayClick}>
      <ModalContent>
        {/* Renderiza o cabeçalho apenas se houver um título */}
        {title && (
          <ModalHeader>
            <ModalTitle>{title}</ModalTitle>
          </ModalHeader>
        )}
        
        <ModalCloseButton onClick={onClose}>&times;</ModalCloseButton>

        <ModalBody>
          {children} {/* O conteúdo principal do modal é renderizado aqui */}
        </ModalBody>

        {/* Renderiza o rodapé apenas se ele for fornecido */}
        {footer && (
          <ModalFooter>
            {footer}
          </ModalFooter>
        )}
      </ModalContent>
    </ModalOverlay>
  );
};

export default Modal;