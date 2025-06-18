import styled, { css } from 'styled-components';

const variants = {
  primary: css`
    background-color: #7c3aed;
    color: white;
    &:hover:not(:disabled) {
      background-color: #6d28d9;
    }
  `,
  secondary: css`
    background-color: #e5e7eb;
    color: #4b5563;
    &:hover:not(:disabled) {
      background-color: #d1d5db;
    }
  `,
  danger: css`
    background-color: #ef4444;
    color: white;
    &:hover:not(:disabled) {
      background-color: #dc2626;
    }
  `,
};

export const ButtonWrapper = styled.button`
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 1em;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out, opacity 0.2s ease-in-out, transform 0.1s ease-in-out;
  
  ${({ variant }) => variants[variant] || variants.primary}

  &:active:not(:disabled) {
    transform: scale(0.98);
  }
  
  &:disabled {
    background-color: #9ca3af;
    color: #e5e7eb;
    cursor: not-allowed;
    opacity: 0.8;
  }
`;