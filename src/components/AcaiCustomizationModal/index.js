// src/components/AcaiCustomizationModal/index.js
import React, { useState, useEffect } from 'react';
import Button from '../Button';
import { useCart } from '../../contexts/CartContext';
import { useStoreSettings } from '../../contexts/StoreSettingsContext';
import { db } from '../../services/firebaseConfig';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import toast from 'react-hot-toast';
import Modal from '../Modal';
import { calculateAcaiPrice } from '../../utils/priceCalculator';
// A importação da constante AÇAI_SIZES foi removida
import {
  SizeOptionsContainer,
  SizeButton,
  PriceInfo,
  ToppingOptionsContainer,
  ToppingLabel,
  ToppingPriceText,
} from './styles';

const AcaiCustomizationModal = ({ isOpen, onClose, productToCustomize }) => {
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedToppings, setSelectedToppings] = useState([]);
  const [currentPrice, setCurrentPrice] = useState(0);
  const { addToCart } = useCart();
  
  // Estados para dados dinâmicos
  const [availableToppings, setAvailableToppings] = useState([]);
  const [availableSizes, setAvailableSizes] = useState([]); // <-- NOVO ESTADO PARA TAMANHOS
  
  // Estados de carregamento
  const [loadingData, setLoadingData] = useState(false);
  
  const { settings } = useStoreSettings();
  const activePromo = productToCustomize?.appliedPromo;

  // Efeito para buscar todos os dados necessários quando o modal abre
  useEffect(() => {
    const fetchModalData = async () => {
      if (!isOpen) return;

      setLoadingData(true);
      try {
        // Prepara as duas buscas em paralelo
        const toppingsQuery = query(collection(db, 'toppings'), where("isAvailable", "==", true), orderBy("name"));
        const sizesQuery = query(collection(db, 'sizes'), orderBy('order', 'asc'));

        const [toppingsSnapshot, sizesSnapshot] = await Promise.all([
          getDocs(toppingsQuery),
          getDocs(sizesQuery)
        ]);
        
        // Processa os adicionais
        const toppingsList = toppingsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setAvailableToppings(toppingsList);
        
        // Processa os tamanhos
        const sizesList = sizesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setAvailableSizes(sizesList);

        // Define o tamanho padrão após os dados serem carregados
        if (sizesList.length > 0 && !activePromo) {
          setSelectedSize(sizesList[0]);
        } else if (activePromo) {
           setSelectedSize({ name: 'Promoção', priceModifier: 0 });
        }
        
        setSelectedToppings([]); // Reseta os adicionais selecionados

      } catch (error) {
        console.error("Erro ao buscar dados para o modal:", error);
        toast.error("Não foi possível carregar as opções.");
        onClose(); // Fecha o modal se houver um erro crítico
      } finally {
        setLoadingData(false);
      }
    };

    fetchModalData();
  }, [isOpen, productToCustomize, activePromo, onClose]);

  // Efeito para calcular o preço (sem alterações)
  useEffect(() => {
    const newPrice = calculateAcaiPrice( productToCustomize, selectedSize, selectedToppings, availableToppings, activePromo );
    setCurrentPrice(newPrice);
  }, [selectedSize, selectedToppings, productToCustomize, availableToppings, activePromo]);

  if (!isOpen || !productToCustomize) return null;

  // ... (O resto das funções handleToppingToggle, handleAddToCartConfigured, etc., permanecem iguais)
  const handleToppingToggle = (toppingId) => {
    const isAlreadySelected = selectedToppings.includes(toppingId);
    const isPromotional = activePromo && activePromo.rules.allowed_topping_ids.includes(toppingId);
    if (isAlreadySelected) { setSelectedToppings(prev => prev.filter(id => id !== toppingId)); } else { if (isPromotional) { const promoSelections = selectedToppings.filter(id => activePromo.rules.allowed_topping_ids.includes(id)); if (promoSelections.length >= activePromo.rules.selection_limit) { toast.error(`Você pode escolher no máximo ${activePromo.rules.selection_limit} adicionais desta promoção.`); return; } } setSelectedToppings(prev => [...prev, toppingId]); }
  };
  const handleAddToCartConfigured = () => {
    if (!activePromo && !selectedSize) { toast.error('Por favor, selecione um tamanho.'); return; }
    const toppingsDetails = availableToppings.filter(t => selectedToppings.includes(t.id));
    const sizeName = activePromo ? '' : ` (${selectedSize.name})`;
    const configuredAcai = { ...productToCustomize, id_cart: `${productToCustomize.id}-${selectedSize?.id || 'promo'}-${selectedToppings.sort().join('-')}-${Date.now()}`, name: `${activePromo ? activePromo.title : productToCustomize.name + sizeName}${toppingsDetails.length > 0 ? ' com ' + toppingsDetails.map(t => t.name).join(', ') : ''}`, selectedSize: activePromo ? 'Promoção' : selectedSize.name, selectedToppings: toppingsDetails, price: currentPrice, quantity: 1, appliedPromotion: activePromo ? activePromo.title : null, };
    addToCart(configuredAcai);
    onClose();
  };
  const promoLimit = activePromo?.rules?.selection_limit || 0;
  const promoToppingIds = activePromo?.rules?.allowed_topping_ids || [];
  const promoSelectionsCount = selectedToppings.filter(id => promoToppingIds.includes(id)).length;
  const limitReached = promoSelectionsCount >= promoLimit;

  const modalFooter = ( <><Button onClick={onClose} variant="secondary">Cancelar</Button><Button onClick={handleAddToCartConfigured} disabled={!settings.isStoreOpen || loadingData} variant="primary">{settings.isStoreOpen ? 'Adicionar ao Carrinho' : 'Loja Fechada'}</Button></> );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Personalize seu ${activePromo ? activePromo.target.productName : productToCustomize.name}`}
      footer={modalFooter}
    >
      {loadingData ? <p>A carregar opções...</p> : (
        <>
          {!activePromo && (
            <SizeOptionsContainer>
              <h4>Escolha o Tamanho:</h4>
              {availableSizes.length > 0 ? (
                availableSizes.map(size => (
                  <SizeButton key={size.id} selected={selectedSize?.id === size.id} onClick={() => setSelectedSize(size)}>
                    {size.name} (+ R$ {size.priceModifier.toFixed(2).replace('.', ',')})
                  </SizeButton>
                ))
              ) : <p>Nenhum tamanho disponível.</p>}
            </SizeOptionsContainer>
          )}

          <ToppingOptionsContainer>
            <h4>{activePromo ? `Escolha até ${promoLimit} dos adicionais abaixo (inclusos no combo):` : "Escolha os Adicionais:"}</h4>
            {availableToppings.map(topping => {
                const isPromotional = activePromo && promoToppingIds.includes(topping.id);
                const isDisabled = isPromotional && limitReached && !selectedToppings.includes(topping.id);
                return ( <ToppingLabel key={topping.id} className={isDisabled ? 'disabled' : ''}> <div> <input type="checkbox" checked={selectedToppings.includes(topping.id)} onChange={() => handleToppingToggle(topping.id)} disabled={isDisabled} /> <span className="topping-name">{topping.name}</span> </div> <ToppingPriceText className={isPromotional ? 'free' : ''}> {isPromotional ? <strong>Grátis</strong> : `+ R$ ${topping.price.toFixed(2).replace('.', ',')}`} </ToppingPriceText> </ToppingLabel> );
            })}
          </ToppingOptionsContainer>

          <PriceInfo>Preço Atual: <strong>R$ {currentPrice.toFixed(2).replace('.', ',')}</strong></PriceInfo>
        </>
      )}
    </Modal>
  );
};

export default AcaiCustomizationModal;