import React, { useState, useEffect } from 'react';
import Button from '../Button';
import { useCart } from '../../contexts/CartContext';
import { useStoreSettings } from '../../contexts/StoreSettingsContext';
import { db } from '../../services/firebaseConfig';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import toast from 'react-hot-toast';
import Modal from '../Modal';
// --- CORREÇÃO 1: Usando o nome correto da função de cálculo ---
import { calculateAcaiPrice } from '../../utils/priceCalculator';
// --- CORREÇÃO 2: Usando os seus componentes de estilo existentes ---
import {
  SizeOptionsContainer,
  SizeButton,
  PriceInfo,
  ToppingOptionsContainer,
  ToppingLabel,
  ToppingInfo,
  ToppingImage,
  ToppingName,
  CheckboxInput,
  ToppingPriceText,
} from './styles';

const AcaiCustomizationModal = ({ isOpen, onClose, productToCustomize }) => {
  // --- CORREÇÃO 3: Todos os Hooks são chamados no início, incondicionalmente ---
  const { addToCart } = useCart();
  const { settings } = useStoreSettings();

  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedToppings, setSelectedToppings] = useState([]);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [availableToppings, setAvailableToppings] = useState([]);
  const [availableSizes, setAvailableSizes] = useState([]);
  const [loadingData, setLoadingData] = useState(false);

  // A promoção aplicada é extraída do produto
  const activePromo = productToCustomize?.appliedPromo;

  // Busca os dados (tamanhos, adicionais) quando o modal abre
  useEffect(() => {
    const fetchModalData = async () => {
      setLoadingData(true);
      try {
        const toppingsQuery = query(collection(db, 'toppings'), where("isAvailable", "==", true), orderBy("name"));
        const sizesQuery = query(collection(db, 'sizes'), orderBy('order', 'asc'));
        
        const [toppingsSnapshot, sizesSnapshot] = await Promise.all([
          getDocs(toppingsQuery),
          getDocs(sizesQuery)
        ]);

        const toppingsList = toppingsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setAvailableToppings(toppingsList);

        const sizesList = sizesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setAvailableSizes(sizesList);

        // Define um tamanho padrão se não for uma promoção
        if (sizesList.length > 0 && !activePromo) {
          setSelectedSize(sizesList[0]);
        } else if (activePromo) {
          // Em promoções, o "tamanho" é definido pelo preço promocional
          setSelectedSize({ name: 'Promoção', price: activePromo.promotionalPrice });
        }
        // Reseta os adicionais selecionados
        setSelectedToppings([]);
      } catch (error) {
        toast.error("Não foi possível carregar as opções.");
        console.error("Erro ao carregar dados do modal:", error);
        onClose();
      } finally {
        setLoadingData(false);
      }
    };

    if (isOpen) {
      fetchModalData();
    }
  }, [isOpen, productToCustomize, activePromo, onClose]);

  // Recalcula o preço total sempre que uma opção muda
  useEffect(() => {
    // Só calcula se o produto existir
    if (productToCustomize) {
        const newPrice = calculateAcaiPrice(
            productToCustomize,
            selectedSize,
            selectedToppings,
            availableToppings,
            activePromo
        );
        setCurrentPrice(newPrice);
    }
  }, [selectedSize, selectedToppings, productToCustomize, availableToppings, activePromo]);

  // --- CORREÇÃO 4: A trava de segurança vem DEPOIS dos hooks ---
  // Se o modal não deve estar aberto ou não tem produto, não renderiza nada.
  if (!isOpen || !productToCustomize) {
    return null;
  }

  const handleToppingToggle = (toppingId) => {
    const isAlreadySelected = selectedToppings.includes(toppingId);
    
    // Verifica se o adicional faz parte da promoção
    const isPromotional = activePromo && activePromo.rules.allowed_topping_ids.includes(toppingId);

    if (isAlreadySelected) {
      setSelectedToppings(prev => prev.filter(id => id !== toppingId));
    } else {
      // Se for um adicional da promoção, verifica o limite
      if (isPromotional) {
        const promoSelections = selectedToppings.filter(id => activePromo.rules.allowed_topping_ids.includes(id));
        if (promoSelections.length >= activePromo.rules.selection_limit) {
          toast.error(`Você pode escolher no máximo ${activePromo.rules.selection_limit} adicionais desta promoção.`);
          return; // Impede de adicionar mais que o limite
        }
      }
      setSelectedToppings(prev => [...prev, toppingId]);
    }
  };

  const handleAddToCartConfigured = () => {
    if (!activePromo && !selectedSize) {
      toast.error('Por favor, selecione um tamanho.');
      return;
    }

    const toppingsDetails = availableToppings.filter(t => selectedToppings.includes(t.id));
    
    // Define um nome mais claro para o item no carrinho
    const sizeName = activePromo ? '' : ` (${selectedSize.name})`;
    const configuredAcai = {
      ...productToCustomize,
      id_cart: `${productToCustomize.id}-${selectedSize?.id || 'promo'}-${Date.now()}`,
      name: `${activePromo ? activePromo.title : productToCustomize.name + sizeName}`,
      selectedSize: activePromo ? 'Promoção' : selectedSize.name,
      selectedToppings: toppingsDetails,
      price: currentPrice,
      quantity: 1, // A quantidade será controlada no carrinho
      appliedPromotion: activePromo ? activePromo.title : null,
    };
    
    addToCart(configuredAcai);
    onClose();
  };

  // Lógica para o rodapé do modal
  const modalFooter = (
    <>
      <Button onClick={onClose} variant="secondary">Cancelar</Button>
      <Button onClick={handleAddToCartConfigured} disabled={!settings.isStoreOpen || loadingData} variant="primary">
        {settings.isStoreOpen ? `Adicionar (R$ ${currentPrice.toFixed(2).replace('.', ',')})` : 'Loja Fechada'}
      </Button>
    </>
  );

  const promoLimit = activePromo?.rules?.selection_limit || 0;
  const promoToppingIds = activePromo?.rules?.allowed_topping_ids || [];
  const promoSelectionsCount = selectedToppings.filter(id => promoToppingIds.includes(id)).length;
  const limitReached = promoSelectionsCount >= promoLimit;

  // Usa o productName do alvo da promoção se for uma promo, senão o nome do produto
  const modalTitle = `Personalize seu ${activePromo ? productToCustomize.name : productToCustomize.name}`;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={modalTitle} footer={modalFooter}>
      {loadingData ? <p>A carregar opções...</p> : (
        <>
          {/* SEÇÃO DE TAMANHOS: renderiza apenas se NÃO for uma promoção de combo */}
          {!activePromo && (
            <SizeOptionsContainer>
              <h4>Escolha o Tamanho:</h4>
              {availableSizes.length > 0 ? (
                availableSizes.map(size => (
                  <SizeButton key={size.id} selected={selectedSize?.id === size.id} onClick={() => setSelectedSize(size)}>
                    {size.name} - R$ {size.price.toFixed(2).replace('.', ',')}
                  </SizeButton>
                ))
              ) : <p>Nenhum tamanho disponível.</p>}
            </SizeOptionsContainer>
          )}
          
          {/* SEÇÃO DE ADICIONAIS: usa a estrutura do seu código original */}
          <ToppingOptionsContainer>
            <h4>{activePromo ? `Escolha até ${promoLimit} dos adicionais abaixo (inclusos no combo):` : "Escolha os Adicionais:"}</h4>
            {availableToppings.map(topping => {
              const isPromotional = activePromo && promoToppingIds.includes(topping.id);
              // Desabilita o checkbox se o limite da promoção foi atingido e o item não está selecionado
              const isDisabled = isPromotional && limitReached && !selectedToppings.includes(topping.id);
              
              // Em uma promoção, só mostra os adicionais permitidos
              if(activePromo && !isPromotional) return null;

              return (
                <ToppingLabel key={topping.id} className={isDisabled ? 'disabled' : ''}>
                  <ToppingInfo>
                    {topping.imageUrl && <ToppingImage src={topping.imageUrl} alt={topping.name} />}
                    <CheckboxInput type="checkbox" checked={selectedToppings.includes(topping.id)} onChange={() => handleToppingToggle(topping.id)} disabled={isDisabled} />
                    <ToppingName>{topping.name}</ToppingName>
                  </ToppingInfo>
                  <ToppingPriceText className={isPromotional ? 'free' : ''}>
                    {isPromotional ? <strong>Grátis</strong> : `+ R$ ${topping.price.toFixed(2).replace('.', ',')}`}
                  </ToppingPriceText>
                </ToppingLabel>
              );
            })}
          </ToppingOptionsContainer>

          <PriceInfo>Preço Atual: <strong>R$ {currentPrice.toFixed(2).replace('.', ',')}</strong></PriceInfo>
        </>
      )}
    </Modal>
  );
};

export default AcaiCustomizationModal;