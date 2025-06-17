// src/components/Modal/styles.js
import styled from 'styled-components';

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.65);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 15px;
`;

export const ModalContent = styled.div`
  background-color: #fff;
  padding: 25px 30px;
  border-radius: 12px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.25);
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  position: relative;
  animation: fadeIn 0.3s ease-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
`;

export const ModalHeader = styled.div`
  padding-bottom: 15px;
  margin-bottom: 20px;
  border-bottom: 1px solid #eee;
`;

export const ModalTitle = styled.h2`
  color: #7c3aed;
  margin: 0;
  text-align: center;
  font-size: 1.5em;
`;

export const ModalCloseButton = styled.button`
  position: absolute;
  top: 15px;
  right: 15px;
  background: transparent;
  border: none;
  font-size: 2em;
  line-height: 1;
  cursor: pointer;
  color: #aaa;
  transition: color 0.2s, transform 0.2s;

  &:hover {
    color: #333;
    transform: scale(1.1);
  }
`;

export const ModalBody = styled.div`
  overflow-y: auto; /* Adiciona scroll se o conteúdo for grande */
  flex-grow: 1;
`;

export const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 30px;
  border-top: 1px solid #eee;
  padding-top: 20px;
`;