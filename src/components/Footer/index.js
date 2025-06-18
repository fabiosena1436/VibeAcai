// src/components/Footer/index.js
import React from 'react';
import { FaWhatsapp, FaFacebook, FaInstagram } from 'react-icons/fa';
import {
  FooterContainer,
  ContentWrapper,
  SocialLinks,
  SocialLink,
  AddressText,
  CopyrightText
} from './styles';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <FooterContainer>
      <ContentWrapper>
        <SocialLinks>
          {/* IMPORTANTE: Substitua '#' pelos links reais das suas redes sociais */}
          <SocialLink href="https://wa.me/SEUNUMERO" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
            <FaWhatsapp />
          </SocialLink>
          <SocialLink href="#" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
            <FaFacebook />
          </SocialLink>
          <SocialLink href="#" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <FaInstagram />
          </SocialLink>
        </SocialLinks>

        <AddressText>
          {/* IMPORTANTE: Substitua pelo seu endereço real */}
          Rua do Açaí, 123 - Bairro Saboroso, Cidade - SP
        </AddressText>
        
        <CopyrightText>
          &copy; {currentYear} Vibe Açaí. Todos os direitos reservados.
        </CopyrightText>
      </ContentWrapper>
    </FooterContainer>
  );
};

export default Footer;