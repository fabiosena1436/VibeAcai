// src/contexts/CartContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext();

const CART_STORAGE_KEY = 'vibeAcaiCart';

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const storedCartItems = window.localStorage.getItem(CART_STORAGE_KEY);
      return storedCartItems ? JSON.parse(storedCartItems) : [];
    } catch (error) {
      console.error("Erro ao ler o carrinho do localStorage:", error);
      return [];
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch (error) {
      console.error("Erro ao salvar o carrinho no localStorage:", error);
    }
  }, [cartItems]);

  const addToCart = (itemToAdd) => {
    setCartItems(prevItems => {
      const itemIdValue = itemToAdd.id_cart || itemToAdd.id;
      const existingItem = prevItems.find(
        item => (item.id_cart || item.id) === itemIdValue
      );
      if (existingItem) {
        return prevItems.map(item =>
          (item.id_cart || item.id) === itemIdValue
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        const newItem = itemToAdd.quantity ? itemToAdd : { ...itemToAdd, quantity: 1 };
        return [...prevItems, newItem];
      }
    });

    // --- MUDANÇA: Mensagem padronizada e mais limpa ---
    toast.success(`${itemToAdd.name} foi adicionado ao carrinho!`);
  };

  const removeFromCart = (productIdOrCartId) => {
    setCartItems(prevItems => prevItems.filter(item =>
      (item.id_cart || item.id) !== productIdOrCartId
    ));
  };

  const increaseQuantity = (productIdOrCartId) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        (item.id_cart || item.id) === productIdOrCartId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const decreaseQuantity = (productIdOrCartId) => {
    setCartItems(prevItems => {
      const itemToDecrease = prevItems.find(item => (item.id_cart || item.id) === productIdOrCartId);
      if (itemToDecrease && itemToDecrease.quantity === 1) {
        return prevItems.filter(item => (item.id_cart || item.id) !== productIdOrCartId);
      }
      return prevItems.map(item =>
        (item.id_cart || item.id) === productIdOrCartId
          ? { ...item, quantity: item.quantity - 1 }
          : item
      );
    });
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const contextValue = {
    cartItems,
    addToCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
  };

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart deve ser usado dentro de um CartProvider');
  }
  return context;
};