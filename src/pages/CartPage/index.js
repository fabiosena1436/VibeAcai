// src/pages/CartPage/index.js
import React, { useState, useEffect } from 'react';
import { useCart } from '../../contexts/CartContext';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import { db } from '../../services/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

// --- STYLED COMPONENTS (sem alterações) ---
const CartPageWrapper = styled.div`padding: 20px; max-width: 900px; margin: 40px auto; background-color: #fff; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); @media (max-width: 768px) { margin: 20px 0; padding: 15px; border-radius: 0; box-shadow: none; min-height: calc(100vh - 70px); }`;
const Title = styled.h1`text-align: center; color: #7c3aed; margin-bottom: 30px; margin-top: 7%; @media (max-width: 768px) { font-size: 1.8em; margin-bottom: 20px; }`;
const ItemTopRow = styled.div`display: flex; justify-content: space-between; align-items: flex-start; width: 100%;`;
const CartItem = styled.div`display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #eee; padding: 15px 0; gap: 15px; &:last-child { border-bottom: none; } @media (max-width: 768px) { flex-direction: column; align-items: flex-start; gap: 12px; }`;
const ItemDetails = styled.div`flex-grow: 1; display: flex; align-items: center; img { width: 60px; height: 60px; object-fit: cover; border-radius: 4px; margin-right: 15px; } @media (max-width: 768px) { img { width: 50px; height: 50px; } }`;
const ItemName = styled.h4`margin: 0 0 5px 0; color: #333; max-width: 250px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; @media (max-width: 768px) { white-space: normal; max-width: 100%; }`;
const ItemPrice = styled.p`margin: 0; color: #666; font-size: 0.9em;`;
const QuantityControl = styled.div`display: flex; align-items: center; min-width: 120px; justify-content: center; button { background-color: #eee; border: none; color: #333; padding: 5px 10px; cursor: pointer; border-radius: 4px; margin: 0 5px; font-size: 1em; &:hover { background-color: #ddd; } } @media (max-width: 768px) { justify-content: flex-start; min-width: auto; }`;
const ItemQuantityDisplay = styled.span`font-weight: bold; margin: 0 10px;`;
const ItemSubtotal = styled.span`font-weight: bold; color: #7c3aed; min-width: 100px; text-align: right; @media (max-width: 768px) { text-align: left; min-width: auto; font-size: 1.1em; &::before { content: 'Subtotal: '; font-weight: normal; color: #555; } }`;
const RemoveButton = styled.button`font-size: 0.9em; margin-left: 15px; background-color: #ef4444; color: white; padding: 6px 12px; &:hover { background-color: #dc2626; } @media (max-width: 768px) { width: auto; margin-left: 10px; background-color: transparent; color: #ef4444; padding: 5px; font-size: 1.5em; font-weight: bold; line-height: 1; &:hover { background-color: #fef2f2; } }`;
const EmptyCartMessage = styled.p`text-align: center; font-size: 1.2em; color: #555; padding: 40px 0;`;
const TotalsSection = styled.div`margin-top: 30px; padding-top: 20px; border-top: 2px solid #f0f0f0; display: flex; flex-direction: column; align-items: flex-end; @media (max-width: 768px) { align-items: stretch; }`;
const SummaryLine = styled.div`display: flex; justify-content: space-between; width: 100%; max-width: 350px; font-size: 1.1em; padding: 8px 0; span:first-child { color: #555; } span:last-child { font-weight: 600; color: #333; } @media (max-width: 768px) { max-width: 100%; }`;
const GrandTotalLine = styled(SummaryLine)`font-size: 1.4em; font-weight: bold; margin-top: 10px; padding-top: 10px; border-top: 2px solid #7c3aed; span:last-child { color: #7c3aed; }`;
const ActionsWrapper = styled.div`display: flex; flex-direction: column; gap: 15px; margin-top: 40px;`;
const TopButtonsContainer = styled.div`display: flex; gap: 15px; & > * { flex: 1; }`;

const STORE_SETTINGS_DOC_ID = "mainConfig";

const CartPage = () => {
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
        <CartPageWrapper><Title>Seu Carrinho de Compras</Title><EmptyCartMessage>Seu carrinho está vazio. Que tal adicionar alguns produtos?</EmptyCartMessage><ActionsWrapper><Link to="/menu"><Button>Ver Cardápio</Button></Link></ActionsWrapper></CartPageWrapper>
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