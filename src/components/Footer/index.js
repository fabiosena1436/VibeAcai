// src/components/Footer/index.js

import React from 'react';
import { FooterContainer, FooterContent, SocialLinks, Address } from './styles'; // Verifique se os estilos estão sendo importados do arquivo styles.js
import { useStoreSettings } from '../../contexts/StoreSettingsContext'; // Importando nosso hook

// Importando ícones
import { FaWhatsapp, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  // Usando o hook para pegar as configurações e o status de carregamento
  const { settings, loading } = useStoreSettings();

  // Se estiver carregando, podemos opcionalmente não mostrar nada ou um placeholder
  if (loading) {
    return null; // ou um <FooterContainer> com um "Carregando..."
  }

  return (
    <FooterContainer>
      <FooterContent>
        <p>© {new Date().getFullYear()} Vibe Açaí. Todos os direitos reservados.</p>
        
        {/* --- NOSSAS NOVAS ADIÇÕES --- */}
        <SocialLinks>
          {/* Renderiza o link do Instagram apenas se ele existir nas configurações */}
          {settings.instagram && (
            <a 
              href={`https://instagram.com/${settings.instagram}`} 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <FaInstagram size={24} />
            </a>
          )}
          {/* Renderiza o link do WhatsApp apenas se ele existir */}
          {settings.whatsapp && (
            <a 
              href={`https://wa.me/${settings.whatsapp}`}
              target="_blank" 
              rel="noopener noreferrer"
              aria-label="WhatsApp"
            >
              <FaWhatsapp size={24} />
            </a>
          )}
        </SocialLinks>

        {/* Renderiza o endereço apenas se ele existir */}
        {settings.address && (
          <Address>
            <p>{settings.address}</p>
          </Address>
        )}
        {/* --- FIM DAS NOVAS ADIÇÕES --- */}

      </FooterContent>
    </FooterContainer>
  );
};

export default Footer;