// src/components/Button/styles.js
import styled from 'styled-components';

// Mapeamento das variantes para as suas cores
const variantStyles = {
  primary: {
    background: '#7c3aed',
    color: '#fff',
    hoverBackground: '#6d28d9',
  },
  danger: {
    background: '#dc2626',
    color: '#fff',
    hoverBackground: '#b91c1c',
  },
  secondary: {
    background: '#6b7280',
    color: '#fff',
    hoverBackground: '#4b5563',
  },
  // Adicionando variantes que faltavam para outros botões que vi no código
  success: {
    background: '#22c55e',
    color: '#fff',
    hoverBackground: '#16a34a',
  },
  warning: {
    background: '#7c3aed',
    color: '#fff',
    hoverBackground: '#7c3aed',
  },
  // Variante especial para o botão de "Desativar"
  toggleOff: {
    background: '#7c3aed',
    color: '#422006',
    hoverBackground: '#7c3aed',
  }
};

export const StyledButton = styled.button`
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 1em;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out, transform 0.1s ease-in-out;

  /* Aplica os estilos com base na prop 'variant' */
  background-color: ${({ variant }) => variantStyles[variant]?.background || variantStyles.primary.background};
  color: ${({ variant }) => variantStyles[variant]?.color || variantStyles.primary.color};

  &:hover:not(:disabled) {
    background-color: ${({ variant }) => variantStyles[variant]?.hoverBackground || variantStyles.primary.hoverBackground};
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
    opacity: 0.7;
  }

  &:active:not(:disabled) {
    transform: scale(0.98);
  }
`;