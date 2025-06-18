import React, { useState, useEffect, useCallback } from 'react';
import { db } from '../../services/firebaseConfig';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import toast from 'react-hot-toast';

import { useCart } from '../../contexts/CartContext';
import { useStoreSettings } from '../../contexts/StoreSettingsContext';
// --- ERRO CORRIGIDO: Importa o nome correto da função ---
import { calculateAcaiPrice } from '../../utils/priceCalculator';

import Modal from '../Modal';
import Button from '../Button';
// --- ERRO CORRIGIDO: Importa os componentes de estilo corretos ---
import { SectionTitle, OptionsGrid, OptionItem, Counter, ToppingCategory, LoadingContainer } from './styles';

const AcaiCustomizationModal = ({ isOpen, onClose, productToCustomize }) => {
  const { addToCart } = useCart();
  const { settings } = useStoreSettings();

  const [sizes, setSizes] = useState([]);
  const [toppings, setToppings] = useState([]);
  const [loadingData, setLoadingData] = useState(false);

  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedToppings, setSelectedToppings] = useState({});
  const [currentPrice, setCurrentPrice] = useState(0);

  const promotion = productToCustomize?.appliedPromo;
  const isFreeToppingPromo = promotion?.type === 'free_toppings_selection';
  const freeToppingsLimit = isFreeToppingPromo ? promotion.rules.selection_limit : 0;
  const totalSelectedToppings = Object.values(selectedToppings).reduce((acc, count) => acc + count, 0);

  useEffect(() => {
    const fetchData = async () => {
      if (!isOpen) return;
      setLoadingData(true);
      try {
        const sizesRef = collection(db, 'sizes');
        const toppingsRef = collection(db, 'toppings');
        const qSizes = query(sizesRef, orderBy('price'));
        const qToppings = query(toppingsRef, orderBy('name'));

        const [sizesSnapshot, toppingsSnapshot] = await Promise.all([
          getDocs(qSizes),
          getDocs(qToppings)
        ]);
        
        const sizesData = sizesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const toppingsData = toppingsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        setSizes(sizesData);
        setToppings(toppingsData);

        const initialSize = sizesData.find(s => s.name.replace('ml', '') === productToCustomize?.size) || sizesData[0];
        if (initialSize) {
          setSelectedSize(initialSize);
        }

      } catch (error) {
        console.error("Erro ao buscar dados de personalização:", error);
        toast.error("Não foi possível carregar as opções de personalização.");
      } finally {
        setLoadingData(false);
      }
    };
    fetchData();
  }, [isOpen, productToCustomize]);

  useEffect(() => {
    if (productToCustomize) {
      // --- ERRO CORRIGIDO: Usa o nome correto da função ---
      const newPrice = calculateAcaiPrice(productToCustomize, selectedSize, selectedToppings, toppings, promotion);
      setCurrentPrice(newPrice);
    }
  }, [selectedSize, selectedToppings, productToCustomize, toppings, promotion]);

  const handleToppingChange = (topping, change) => {
    const currentCount = selectedToppings[topping.id] || 0;
    const newCount = Math.max(0, currentCount + change);

    if (change > 0 && isFreeToppingPromo && totalSelectedToppings >= freeToppingsLimit) {
      toast.error(`Você já selecionou o limite de ${freeToppingsLimit} adicionais grátis.`);
      return;
    }

    setSelectedToppings(prev => ({ ...prev, [topping.id]: newCount }));
  };

  const handleAddToCartConfigured = () => {
    if (!selectedSize) {
      toast.error('Por favor, selecione um tamanho.');
      return;
    }

    const toppingsList = Object.entries(selectedToppings)
      .filter(([, qty]) => qty > 0)
      .map(([id, qty]) => {
        const toppingDetails = toppings.find(t => t.id === id);
        return { ...toppingDetails, quantity: qty };
      });
      
    const cartItem = {
      ...productToCustomize,
      id_cart: `${productToCustomize.id}-${Date.now()}`,
      name: `${productToCustomize.name} ${selectedSize.name}`,
      price: currentPrice,
      quantity: 1,
      size: selectedSize,
      toppings: toppingsList,
      appliedPromotion: promotion ? promotion.title : null
    };

    addToCart(cartItem);
    toast.success(`${cartItem.name} foi adicionado ao carrinho!`);
    resetAndClose();
  };

  const resetAndClose = useCallback(() => {
    setSelectedSize(null);
    setSelectedToppings({});
    setCurrentPrice(0);
    onClose();
  }, [onClose]);

  const groupToppingsByCategory = () => {
    return toppings.reduce((acc, topping) => {
      const category = topping.category || 'Outros';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(topping);
      return acc;
    }, {});
  };

  const groupedToppings = groupToppingsByCategory();

  const modalFooter = (
    <>
      <Button onClick={resetAndClose} variant="secondary">Cancelar</Button>
      <Button 
        onClick={handleAddToCartConfigured} 
        disabled={!settings.isStoreOpen || loadingData || !selectedSize} 
        variant="primary"
      >
        {loadingData ? 'Carregando...' : (settings.isStoreOpen ? `Adicionar (R$ ${currentPrice.toFixed(2).replace('.', ',')})` : 'Loja Fechada')}
      </Button>
    </>
  );

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={resetAndClose} 
      title={`Monte seu ${productToCustomize?.name || 'Açaí'}`}
      footer={modalFooter}
    >
      {loadingData ? (
        <LoadingContainer>Carregando opções...</LoadingContainer>
      ) : (
        <>
          <SectionTitle>1. Escolha o Tamanho</SectionTitle>
          <OptionsGrid>
            {sizes.map(size => (
              <OptionItem 
                key={size.id} 
                $isSelected={selectedSize?.id === size.id}
                onClick={() => setSelectedSize(size)}
              >
                {size.name} (+ R$ {size.price.toFixed(2).replace('.', ',')})
              </OptionItem>
            ))}
          </OptionsGrid>
          
          <SectionTitle>
            2. Adicionais
            {isFreeToppingPromo && ` (Escolha ${freeToppingsLimit} grátis - ${totalSelectedToppings}/${freeToppingsLimit})`}
          </SectionTitle>
          
          {Object.entries(groupedToppings).map(([category, items]) => (
            <div key={category}>
              <ToppingCategory>{category}</ToppingCategory>
              <OptionsGrid>
                {items.map(topping => (
                  <OptionItem key={topping.id} $isTopping={true}>
                    <span>{topping.name} (+ R$ {topping.price.toFixed(2).replace('.', ',')})</span>
                    <Counter>
                      <button onClick={() => handleToppingChange(topping, -1)} disabled={(selectedToppings[topping.id] || 0) === 0}>-</button>
                      <span>{selectedToppings[topping.id] || 0}</span>
                      <button onClick={() => handleToppingChange(topping, 1)} disabled={isFreeToppingPromo && totalSelectedToppings >= freeToppingsLimit}>+</button>
                    </Counter>
                  </OptionItem>
                ))}
              </OptionsGrid>
            </div>
          ))}
        </>
      )}
    </Modal>
  );
};

export default AcaiCustomizationModal;