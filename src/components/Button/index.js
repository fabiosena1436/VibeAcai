// src/components/Button/index.js
import React from 'react';
import { StyledButton } from './styles'; // Importamos nosso botão estilizado

const Button = ({ children, onClick, type = 'button' }) => {
  return (
    <StyledButton type={type} onClick={onClick}>
      {children}
    </StyledButton>
  );
};

export default Button;