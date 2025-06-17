// src/pages/CartPage/index.js
import React, { useState, useEffect } from 'react';
import { useCart } from '../../contexts/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import { db } from '../../services/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import {
  CartPageWrapper,
  Title,
  ItemTopRow,
  CartItem,
  ItemDetails,
  ItemName,
  ItemPrice,
  QuantityControl,
  ItemQuantityDisplay,
  ItemSubtotal,
  RemoveButton,
  EmptyCartMessage,
  TotalsSection,
  SummaryLine,
  GrandTotalLine,
  ActionsWrapper,
  TopButtonsContainer
} from './styles'; // Importando os estilos

const STORE_SETTINGS_DOC_ID = "mainConfig";

const CartPage = () => {
    // ... A LÓGICA PERMANECE IGUAL ...
    const { cartItems, removeFromCart, increaseQuantity, decreaseQuantity, clearCart } = useCart();
    const navigate = useNavigate();
    const [storeDeliveryFee, setStoreDeliveryFee] = useState(0);
    const [loadingSettings, setLoadingSettings] = useState(true);
  
    useEffect(() => {
      const fetchSettings = async () => {
        setLoadingSettings(true);
        try {
          const settingsDocRef = doc(db, 'storeSettings', STORE_SETTINGS_DOC_ID);
          const docSnap = await getDoc(settingsDocRef);
          if (docSnap.exists() && docSnap.data().deliveryFee !== undefined) {
            setStoreDeliveryFee(docSnap.data().deliveryFee);
          } else { setStoreDeliveryFee(0); }
        } catch (error) { console.error("Erro ao buscar configurações:", error); setStoreDeliveryFee(0); }
        finally { setLoadingSettings(false); }
      };
      fetchSettings();
    }, []);
  
    const calculateItemsSubtotal = () => cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    const calculateGrandTotal = () => calculateItemsSubtotal() + storeDeliveryFee;
    const handleClearCart = () => { if (window.confirm("Tem certeza que deseja limpar o carrinho?")) { clearCart(); }};
    const handleProceedToCheckout = () => { if (cartItems.length === 0) { alert("Seu carrinho está vazio!"); return; } navigate('/checkout'); };
  
    if (cartItems.length === 0) {
      return (
        <CartPageWrapper>
          <Title>Seu Carrinho de Compras</Title>
          <EmptyCartMessage>Seu carrinho está vazio. Que tal adicionar alguns produtos?</EmptyCartMessage>
          <ActionsWrapper>
            <Link to="/menu"><Button>Ver Cardápio</Button></Link>
          </ActionsWrapper>
        </CartPageWrapper>
      );
    }
  
    return (
      <CartPageWrapper>
        <Title>Seu Carrinho de Compras</Title>
        {cartItems.map(item => (
          <CartItem key={item.id_cart || item.id}>
            <ItemTopRow>
              <ItemDetails>
                <img src={item.imageUrl || 'https://via.placeholder.com/60x60.png?text=Vibe'} alt={item.name} />
                <div>
                  <ItemName title={item.name}>{item.name}</ItemName>
                  {item.selectedToppings && item.selectedToppings.length > 0 && (<p style={{ fontSize: '0.8em', color: '#777', margin: '2px 0 0 0', fontStyle: 'italic' }}>Adicionais: {item.selectedToppings.map(topping => topping.name).join(', ')}</p>)}
                  <ItemPrice>R$ {item.price.toFixed(2).replace('.', ',')} /un.</ItemPrice>
                </div>
              </ItemDetails>
              <RemoveButton onClick={() => removeFromCart(item.id_cart || item.id)}>&#x2715;</RemoveButton>
            </ItemTopRow>
            <div style={{display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'flex-start'}}>
                <QuantityControl><button onClick={() => decreaseQuantity(item.id_cart || item.id)}>-</button><ItemQuantityDisplay>{item.quantity}</ItemQuantityDisplay><button onClick={() => increaseQuantity(item.id_cart || item.id)}>+</button></QuantityControl>
                <ItemSubtotal>R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}</ItemSubtotal>
            </div>
          </CartItem>
        ))}
        <TotalsSection>
          <SummaryLine><span>Subtotal dos Itens:</span><strong>R$ {calculateItemsSubtotal().toFixed(2).replace('.', ',')}</strong></SummaryLine>
          {loadingSettings ? (<SummaryLine><span>Carregando taxa de entrega...</span></SummaryLine>) : storeDeliveryFee > 0 && (<SummaryLine><span>Taxa de Entrega:</span><strong>R$ {storeDeliveryFee.toFixed(2).replace('.', ',')}</strong></SummaryLine>)}
          <GrandTotalLine><span>Total Geral:</span><strong>R$ {calculateGrandTotal().toFixed(2).replace('.', ',')}</strong></GrandTotalLine>
        </TotalsSection>
        <ActionsWrapper>
          <TopButtonsContainer>
            <Link to="/menu" style={{ textDecoration: 'none', flex: 1 }}><Button variant="secondary" style={{width: '100%'}}>Continuar Comprando</Button></Link>
            <Button variant="warning" onClick={handleClearCart}>Limpar Carrinho</Button>
          </TopButtonsContainer>
          <Button variant="primary" onClick={handleProceedToCheckout} style={{width: '100%'}}>Finalizar Compra</Button>
        </ActionsWrapper>
      </CartPageWrapper>
    );
};
  
export default CartPage;