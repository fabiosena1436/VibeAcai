// src/contexts/CartContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext();

// Chave para salvar os dados no localStorage
const CART_STORAGE_KEY = 'vibeAcaiCart';

export const CartProvider = ({ children }) => {
  // 1. Inicialização do estado a partir do localStorage
  const [cartItems, setCartItems] = useState(() => {
    try {
      const storedCartItems = window.localStorage.getItem(CART_STORAGE_KEY);
      // Se houver itens salvos, use-os. Senão, comece com um array vazio.
      return storedCartItems ? JSON.parse(storedCartItems) : [];
    } catch (error) {
      console.error("Erro ao ler o carrinho do localStorage:", error);
      return []; // Em caso de erro, comece com um carrinho vazio
    }
  });

  // 2. Efeito para salvar o carrinho no localStorage sempre que ele mudar
  useEffect(() => {
    try {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
      console.log('Carrinho salvo no localStorage:', cartItems);
    } catch (error) {
      console.error("Erro ao salvar o carrinho no localStorage:", error);
    }
  }, [cartItems]); // Este efeito roda toda vez que 'cartItems' é alterado


  const addToCart = (itemToAdd) => {
    setCartItems(prevItems => {
      // A lógica para adicionar ou incrementar o item permanece a mesma
      const itemIdProperty = itemToAdd.id_cart ? 'id_cart' : 'id';
      const itemIdValue = itemToAdd.id_cart || itemToAdd.id;
      const existingItem = prevItems.find(
        item => (item.id_cart ? item.id_cart : item.id) === itemIdValue
      );
      if (existingItem) {
        return prevItems.map(item =>
          (item.id_cart ? item.id_cart : item.id) === itemIdValue
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        const newItem = itemToAdd.quantity ? itemToAdd : { ...itemToAdd, quantity: 1 };
        return [...prevItems, newItem];
      }
    });

    // AQUI ESTÁ A MUDANÇA:
    // A linha 'alert(...)' foi removida e substituída por 'toast.success(...)'
    toast.success(`"${itemToAdd.name}" adicionado ao carrinho!`);
  };

  const removeFromCart = (productIdOrCartId) => {
    setCartItems(prevItems => prevItems.filter(item =>
      (item.id_cart ? item.id_cart : item.id) !== productIdOrCartId
    ));
  };

  const increaseQuantity = (productIdOrCartId) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        (item.id_cart ? item.id_cart : item.id) === productIdOrCartId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const decreaseQuantity = (productIdOrCartId) => {
    setCartItems(prevItems => {
      const itemToDecrease = prevItems.find(item => (item.id_cart ? item.id_cart : item.id) === productIdOrCartId);
      if (itemToDecrease && itemToDecrease.quantity === 1) {
        return prevItems.filter(item => (item.id_cart ? item.id_cart : item.id) !== productIdOrCartId);
      }
      return prevItems.map(item =>
        (item.id_cart ? item.id_cart : item.id) === productIdOrCartId
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