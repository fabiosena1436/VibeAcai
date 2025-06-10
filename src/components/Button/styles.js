// src/components/Button/styles.js
import styled from 'styled-components';

export const StyledButton = styled.button`
  background-color: #7c3aed; /* Um roxo vibrante, como a vibe do açaí! */
  color: white;
  font-size: 1em;
  margin: 1em;
  padding: 0.5em 1.5em;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #6d28d9; /* Um tom de roxo um pouco mais escuro para o hover */
  }

  &:active {
    background-color: #5b21b6; /* Um tom ainda mais escuro para quando clicado */
  }
`;