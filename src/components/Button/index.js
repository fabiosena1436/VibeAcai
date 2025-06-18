import React from 'react';
// --- ERRO CORRIGIDO: Importa ButtonWrapper, o nome correto do componente de estilo ---
import { ButtonWrapper } from './styles';

/**
 * Um componente de botão reutilizável com variantes.
 * @param {object} props - As props do componente.
 * @param {function} props.onClick - A função a ser chamada quando o botão é clicado.
 * @param {React.ReactNode} props.children - O conteúdo do botão (texto, ícone, etc.).
 * @param {('primary'|'secondary'|'danger')} [props.variant='primary'] - A variante visual do botão.
 * @param {boolean} [props.disabled=false] - Se o botão está desabilitado.
 * @param {string} [props.type='button'] - O tipo do botão (ex: 'button', 'submit').
 * @param {object} [props.style] - Estilos inline para o botão.
 */
const Button = ({ onClick, children, variant = 'primary', disabled = false, type = 'button', style }) => {
  return (
    // --- ERRO CORRIGIDO: Usa ButtonWrapper ---
    <ButtonWrapper
      onClick={onClick}
      variant={variant}
      disabled={disabled}
      type={type}
      style={style}
    >
      {children}
    </ButtonWrapper>
  );
};

export default Button;