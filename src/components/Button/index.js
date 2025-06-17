// src/components/Button/index.js
import React from 'react';
import { StyledButton } from './styles';

/**
 * Componente de Botão reutilizável com variantes de estilo.
 * @param {object} props
 * @param {'primary'|'danger'|'secondary'|'success'|'warning'|'toggleOff'} [props.variant='primary'] - A variante de estilo do botão.
 * @param {React.ReactNode} props.children - O conteúdo do botão.
 * Outras props como `onClick`, `disabled`, etc., são passadas diretamente para o elemento button.
 */
const Button = ({ children, variant = 'primary', ...props }) => {
  return (
    <StyledButton variant={variant} {...props}>
      {children}
    </StyledButton>
  );
};

export default Button;