// src/components/AcaiCustomizationModal/index.js
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Button from '../Button';
import { useCart } from '../../contexts/CartContext';
import { useStoreSettings } from '../../contexts/StoreSettingsContext';
import { db } from '../../services/firebaseConfig';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import toast from 'react-hot-toast';
import Modal from '../Modal'; // Importa nosso novo Modal genérico

// --- ESTILOS ESPECÍFICOS PARA ESTE MODAL ---
const SizeOptionsContainer = styled.div` margin-bottom: 20px; h4 { margin-bottom: 10px; color: #555; }`;
const SizeButton = styled.button` background-color: ${props => props.selected ? '#7c3aed' : '#eee'}; color: ${props => props.selected ? '#fff' : '#333'}; border: 1px solid ${props => props.selected ? '#7c3aed' : '#ddd'}; padding: 10px 15px; margin-right: 10px; margin-bottom: 10px; border-radius: 8px; cursor: pointer; font-size: 0.9em; font-weight: 500; transition: background-color 0.2s, color 0.2s; &:hover { background-color: ${props => props.selected ? '#6d28d9' : '#ddd'};}`;
const PriceInfo = styled.div` margin-top: 20px; font-size: 1.2em; text-align: right; color: #333; font-weight: 500; strong { color: #7c3aed; font-weight: bold; }`;
const ToppingOptionsContainer = styled.div` margin-bottom: 20px; h4 { margin-bottom: 10px; color: #555; } .promo-title { font-size: 1em; color: #7c3aed; font-weight: bold; }`;
const ToppingLabel = styled.label` display: flex; align-items: center; margin-bottom: 8px; cursor: pointer; font-size: 0.95em; justify-content: space-between; &.disabled { cursor: not-allowed; color: #aaa; } .topping-name { margin-left: 10px; } input[type="checkbox"] { width: 18px; height: 18px; accent-color: #7c3aed; margin-right: 10px; }`;
const ToppingPriceText = styled.span` color: #555; font-weight: 500; &.free { color: #16a34a; font-weight: bold; }`;
// --- FIM DOS ESTILOS ESPECÍFICOS ---

const AÇAI_SIZES = [
  { id: 'P', name: 'Pequeno (300ml)', priceModifier: 0 },
  { id: 'M', name: 'Médio (500ml)', priceModifier: 4.00 },
  { id: 'G', name: 'Grande (700ml)', priceModifier: 8.00 },
];

const AcaiCustomizationModal = ({ isOpen, onClose, productToCustomize }) => {
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedToppings, setSelectedToppings] = useState([]);
  const [currentPrice, setCurrentPrice] = useState(0);
  const { addToCart } = useCart();
  const [availableToppings, setAvailableToppings] = useState([]);
  const [loadingToppings, setLoadingToppings] = useState(false);
  const { settings } = useStoreSettings();
  const activePromo = productToCustomize?.appliedPromo;

  // Lógica de busca de dados e cálculo de preço (INTOCADA)
  useEffect(() => {
    const fetchAvailableToppings = async () => {
      if (!isOpen) return;
      setLoadingToppings(true);
      try {
        const toppingsRef = collection(db, 'toppings');
        const toppingsQuery = query(toppingsRef, where("isAvailable", "==", true), orderBy("name"));
        const toppingsSnapshot = await getDocs(toppingsQuery);
        setAvailableToppings(toppingsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) { console.error("Erro ao buscar adicionais:", error); }
      finally { setLoadingToppings(false); }
    };
    fetchAvailableToppings();
    if (isOpen) {
      if (activePromo) { setSelectedSize({ name: 'Promoção', priceModifier: 0 }); } 
      else { setSelectedSize(AÇAI_SIZES[0]); }
      setSelectedToppings([]);
    }
  }, [isOpen, productToCustomize, activePromo]);
  useEffect(() => {
    if (!productToCustomize) return;
    let finalPrice;
    if (activePromo && activePromo.price !== undefined) { finalPrice = activePromo.price; } 
    else if (selectedSize) { finalPrice = productToCustomize.price + (selectedSize.priceModifier || 0); } 
    else { finalPrice = productToCustomize.price; }
    const selectedToppingsObjects = selectedToppings.map(id => availableToppings.find(t => t.id === id)).filter(Boolean);
    const promoToppingIds = activePromo?.rules?.allowed_topping_ids || [];
    selectedToppingsObjects.forEach(topping => { if (!promoToppingIds.includes(topping.id)) { finalPrice += topping.price; } });
    setCurrentPrice(finalPrice);
  }, [selectedSize, selectedToppings, productToCustomize, availableToppings, activePromo]);
  // Fim da lógica intocada

  if (!isOpen || !productToCustomize) { return null; }

  const handleToppingToggle = (toppingId) => {
    const isAlreadySelected = selectedToppings.includes(toppingId);
    const isPromotional = activePromo && activePromo.rules.allowed_topping_ids.includes(toppingId);
    if (isAlreadySelected) {
      setSelectedToppings(prev => prev.filter(id => id !== toppingId));
    } else {
      if (isPromotional) {
        const promoSelections = selectedToppings.filter(id => activePromo.rules.allowed_topping_ids.includes(id));
        if (promoSelections.length >= activePromo.rules.selection_limit) {
          toast.error(`Você pode escolher no máximo ${activePromo.rules.selection_limit} adicionais desta promoção.`);
          return;
        }
      }
      setSelectedToppings(prev => [...prev, toppingId]);
    }
  };

  const handleAddToCartConfigured = () => {
    if (!activePromo && !selectedSize) { toast.error('Por favor, selecione um tamanho.'); return; }
    const toppingsDetails = availableToppings.filter(t => selectedToppings.includes(t.id));
    const sizeName = activePromo ? '' : ` (${selectedSize.name})`;
    const configuredAcai = {
      ...productToCustomize,
      id_cart: `${productToCustomize.id}-${selectedSize?.id || 'promo'}-${selectedToppings.sort().join('-')}-${Date.now()}`,
      name: `${activePromo ? activePromo.title : productToCustomize.name + sizeName}${toppingsDetails.length > 0 ? ' com ' + toppingsDetails.map(t => t.name).join(', ') : ''}`,
      selectedSize: activePromo ? 'Promoção' : selectedSize.name,
      selectedToppings: toppingsDetails,
      price: currentPrice,
      quantity: 1,
      appliedPromotion: activePromo ? activePromo.title : null,
    };
    addToCart(configuredAcai);
    onClose();
  };
  const promoLimit = activePromo?.rules?.selection_limit || 0;
  const promoToppingIds = activePromo?.rules?.allowed_topping_ids || [];
  const promoSelectionsCount = selectedToppings.filter(id => promoToppingIds.includes(id)).length;
  const limitReached = promoSelectionsCount >= promoLimit;

  // Montagem do rodapé para o modal genérico
  const modalFooter = (
    <>
      <Button onClick={onClose} style={{ backgroundColor: '#ccc' }}>Cancelar</Button>
      <Button onClick={handleAddToCartConfigured} disabled={!settings.isStoreOpen}>
        {settings.isStoreOpen ? 'Adicionar ao Carrinho' : 'Loja Fechada'}
      </Button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Personalize seu ${activePromo ? activePromo.target.productName : productToCustomize.name}`}
      footer={modalFooter}
    >
      {!activePromo && (
        <SizeOptionsContainer>
          <h4>Escolha o Tamanho:</h4>
          {AÇAI_SIZES.map(size => (<SizeButton key={size.id} selected={selectedSize?.id === size.id} onClick={() => setSelectedSize(size)}>{size.name} (+ R$ {size.priceModifier.toFixed(2).replace('.', ',')})</SizeButton>))}
        </SizeOptionsContainer>
      )}

      <ToppingOptionsContainer>
        <h4>{activePromo ? `Escolha até ${promoLimit} dos adicionais abaixo (inclusos no combo):` : "Escolha os Adicionais:"}</h4>
        {loadingToppings ? (<p>Carregando...</p>) : (
          availableToppings.map(topping => {
            const isPromotional = activePromo && promoToppingIds.includes(topping.id);
            const isDisabled = isPromotional && limitReached && !selectedToppings.includes(topping.id);
            return (
              <ToppingLabel key={topping.id} className={isDisabled ? 'disabled' : ''}>
                <div>
                  <input type="checkbox" checked={selectedToppings.includes(topping.id)} onChange={() => handleToppingToggle(topping.id)} disabled={isDisabled} />
                  <span className="topping-name">{topping.name}</span>
                </div>
                <ToppingPriceText className={isPromotional ? 'free' : ''}>
                  {isPromotional ? <strong>Grátis</strong> : `+ R$ ${topping.price.toFixed(2).replace('.', ',')}`}
                </ToppingPriceText>
              </ToppingLabel>
            );
          })
        )}
      </ToppingOptionsContainer>
      
      <PriceInfo>Preço Atual: <strong>R$ {currentPrice.toFixed(2).replace('.', ',')}</strong></PriceInfo>
    </Modal>
  );
};
export default AcaiCustomizationModal;