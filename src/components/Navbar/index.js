// src/components/Navbar/index.js

import React, { useState, useEffect } from 'react';
import { useCart } from '../../contexts/CartContext';
import { useStoreSettings } from '../../contexts/StoreSettingsContext';

// Importando todos os nossos componentes de estilo
import {
  NavWrapper,
  NavLogoLink,
  LogoImage,
  NavLinksContainer,
  NavLink,
  CartItemCount,
  MobileIcon,
  MobileMenuWrapper,
  MobileMenuOverlay
} from './styles';

const Navbar = () => {
  const { cartItems } = useCart();
  const { settings } = useStoreSettings();
  const totalItemsInCart = (cartItems || []).reduce((total, item) => total + item.quantity, 0);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const closeMenu = () => setIsMenuOpen(false);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMenuOpen]);

  return (
    <>
      <NavWrapper>
        <NavLogoLink to="/" onClick={closeMenu}>
          {settings.logoUrl ? <LogoImage src={settings.logoUrl} alt="Vibe Açaí" /> : 'Vibe Açaí'}
        </NavLogoLink>

        {/* Menu de Desktop */}
        <NavLinksContainer>
          <NavLink to="/">Home</NavLink>
          <NavLink to="/menu">Cardápio</NavLink>
          <NavLink to="/cart">
            🛒 Carrinho
            {totalItemsInCart > 0 && (<CartItemCount>{totalItemsInCart}</CartItemCount>)}
          </NavLink>
        </NavLinksContainer>

        {/* Ícone do Menu Hambúrguer */}
        <MobileIcon onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? '✕' : '☰'}
        </MobileIcon>
      </NavWrapper>

      {/* Overlay para fechar menu ao clicar fora */}
      <MobileMenuOverlay isOpen={isMenuOpen} onClick={closeMenu} />

      {/* Menu Mobile */}
      <MobileMenuWrapper isOpen={isMenuOpen}>
        <NavLink to="/" onClick={closeMenu}>Home</NavLink>
        <NavLink to="/menu" onClick={closeMenu}>Cardápio</NavLink>
        <NavLink to="/cart" onClick={closeMenu}>
          🛒 Carrinho
          {totalItemsInCart > 0 && (<CartItemCount>{totalItemsInCart}</CartItemCount>)}
        </NavLink>
      </MobileMenuWrapper>
    </>
  );
};

export default Navbar;