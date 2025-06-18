// src/components/Footer/styles.js
import styled from 'styled-components';

export const FooterContainer = styled.footer`
  background-color: #2c2c2c; /* Um cinza escuro e discreto */
  color: #a0a0a0; /* Cor do texto suave */
  padding: 30px 20px;
  text-align: center;
  border-top: 3px solid #BF1B36; /* Detalhe com a cor do tema */
`;

export const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;

export const SocialLinks = styled.div`
  display: flex;
  gap: 25px;
  margin-bottom: 10px;
`;

export const SocialLink = styled.a`
  color: #a0a0a0;
  font-size: 28px; /* Tamanho dos ícones */
  transition: color 0.3s ease, transform 0.3s ease;

  &:hover {
    color: #fff; /* Ícone fica branco ao passar o mouse */
    transform: scale(1.1);
  }
`;

export const AddressText = styled.p`
  margin: 0;
  font-size: 0.9em;
  line-height: 1.5;
`;

export const CopyrightText = styled.p`
  margin-top: 20px;
  font-size: 0.8em;
  color: #777;
`;