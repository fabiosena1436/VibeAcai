// src/components/Footer/styles.js
import styled from 'styled-components';

export const FooterContainer = styled.footer`
  background-color: #333;
  color: white;
  padding: 2rem 1rem;
  text-align: center;
`;

export const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

export const SocialLinks = styled.div`
  display: flex;
  gap: 1.5rem;

  a {
    color: white;
    transition: color 0.3s;
    &:hover {
      color: #a94a9d; /* Um roxo para combinar com açaí */
    }
  }
`;

export const Address = styled.div`
  font-size: 0.9rem;
  opacity: 0.8;
`;