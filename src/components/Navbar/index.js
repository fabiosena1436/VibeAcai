import React, { useState, useEffect } from 'react';
import { useCart } from '../../contexts/CartContext';
import { useStoreSettings } from '../../contexts/StoreSettingsContext';
import { FaShoppingCart } from 'react-icons/fa'; // Importando o ícone

import {
  NavWrapper,
  NavLogoLink,
  LogoImage,
  NavLinksContainer,
  NavLink,
  CartItemCount,
  MobileIcon,
  MobileMenuWrapper,
  MobileMenuOverlay,
  MobileActionsContainer, // <-- Importa o novo container
  MobileCartLink          // <-- Importa o novo link de carrinho
} from './styles';

const Navbar = () => {
  // ATENÇÃO: Verifiquei seu CartContext.js, ele exporta 'cartItems', não 'cart'. Use o nome correto.
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

        {/* Menu de Desktop (permanece o mesmo) */}
        <NavLinksContainer>
          <NavLink to="/">Home</NavLink>
          <NavLink to="/menu">Cardápio</NavLink>
          <NavLink to="/cart">
            <FaShoppingCart /> Carrinho
            {totalItemsInCart > 0 && (<CartItemCount>{totalItemsInCart}</CartItemCount>)}
          </NavLink>
        </NavLinksContainer>
        
        {/* MUDANÇA PRINCIPAL AQUI: Ações no Mobile */}
        <MobileActionsContainer>
          {/* O carrinho agora aparece aqui no mobile, se não estiver vazio */}
          {totalItemsInCart > 0 && (
            <MobileCartLink to="/cart">
              <FaShoppingCart />
              <CartItemCount>{totalItemsInCart}</CartItemCount>
            </MobileCartLink>
          )}
          {/* O ícone do menu hambúrguer continua aqui */}
          <MobileIcon onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? '✕' : '☰'}
          </MobileIcon>
        </MobileActionsContainer>
      </NavWrapper>

      {/* Overlay e Menu Mobile */}
      <MobileMenuOverlay isOpen={isMenuOpen} onClick={closeMenu} />
      <MobileMenuWrapper isOpen={isMenuOpen}>
        <NavLink to="/" onClick={closeMenu}>Home</NavLink>
        <NavLink to="/menu" onClick={closeMenu}>Cardápio</NavLink>
        
        {/* O link do carrinho foi REMOVIDO daqui de dentro */}

      </MobileMenuWrapper>
    </>
  );
};

export default Navbar;