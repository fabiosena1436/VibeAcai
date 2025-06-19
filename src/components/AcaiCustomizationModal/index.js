import React, { useState, useEffect, useCallback } from 'react';
import { db } from '../../services/firebaseConfig';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import toast from 'react-hot-toast';

import { useCart } from '../../contexts/CartContext';
import { useStoreSettings } from '../../contexts/StoreSettingsContext';
import Modal from '../Modal';
import Button from '../Button';
// Importando os componentes de estilo, incluindo os de checkbox
import {
    SectionTitle, OptionsGrid, OptionItem, ToppingCategory, LoadingContainer,
    ToppingImage, ToppingInfo, CheckboxWrapper
} from './styles';

const AcaiCustomizationModal = ({ isOpen, onClose, productToCustomize }) => {
    const { addToCart } = useCart();
    const { settings } = useStoreSettings();

    const [sizes, setSizes] = useState([]);
    const [toppings, setToppings] = useState([]);
    const [loadingData, setLoadingData] = useState(false);

    const [selectedSize, setSelectedSize] = useState(null);
    const [selectedToppings, setSelectedToppings] = useState({}); // Estrutura: { toppingId: true/false }
    const [currentPrice, setCurrentPrice] = useState(0);

    const promotion = productToCustomize?.appliedPromo;
    const isFreeToppingPromo = promotion?.type === 'free_toppings_selection';
    const freeToppingsLimit = isFreeToppingPromo ? promotion.rules.selection_limit : 0;
    
    const totalSelectedToppings = Object.values(selectedToppings).filter(Boolean).length;

    useEffect(() => {
        const fetchData = async () => {
            if (!isOpen) return;
            setLoadingData(true);
            try {
                const sizesRef = collection(db, 'sizes');
                const toppingsRef = collection(db, 'toppings');
                const qSizes = query(sizesRef, orderBy('price'));
                const qToppings = query(toppingsRef, orderBy('name'));
                const [sizesSnapshot, toppingsSnapshot] = await Promise.all([getDocs(qSizes), getDocs(qToppings)]);
                const sizesData = sizesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                const toppingsData = toppingsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setSizes(sizesData);
                setToppings(toppingsData);
                const initialSize = sizesData.find(s => s.name.replace('ml', '') === productToCustomize?.size) || sizesData[0];
                if (initialSize) setSelectedSize(initialSize);
            } catch (error) {
                console.error("Erro ao buscar dados de personalização:", error);
                toast.error("Não foi possível carregar as opções.");
            } finally {
                setLoadingData(false);
            }
        };
        fetchData();
    }, [isOpen, productToCustomize]);

    // --- [CORRIGIDO] LÓGICA DE CÁLCULO DE PREÇO DEFENSIVA PARA EVITAR NAN ---
    useEffect(() => {
        // Se o produto base ainda não foi carregado, o preço é 0.
        if (!productToCustomize) {
            setCurrentPrice(0);
            return;
        }

        // 1. Garante que o preço base seja um número, ou usa 0 como padrão.
        let price = Number(productToCustomize.basePrice) || 0;

        // 2. Adiciona o preço do tamanho apenas se um tamanho estiver selecionado.
        //    Também garante que o preço do tamanho seja um número.
        if (selectedSize) {
            price += Number(selectedSize.price) || 0;
        }

        const selectedToppingIds = Object.keys(selectedToppings).filter(id => selectedToppings[id]);
        let freeToppingsCount = 0;

        selectedToppingIds.forEach(id => {
            const topping = toppings.find(t => t.id === id);
            if (topping) {
                if (isFreeToppingPromo && freeToppingsCount < freeToppingsLimit) {
                    freeToppingsCount++; // Adicional grátis, não altera o preço.
                } else {
                    // 3. Garante que o preço do adicional seja um número antes de somar.
                    price += Number(topping.price) || 0;
                }
            }
        });

        setCurrentPrice(price);
    }, [selectedSize, selectedToppings, productToCustomize, toppings, isFreeToppingPromo, freeToppingsLimit]);

    const handleToppingToggle = (topping) => {
        const isCurrentlySelected = !!selectedToppings[topping.id];

        // LÓGICA PRESERVADA: Bloqueia a adição se o limite da promoção for atingido
        if (!isCurrentlySelected && isFreeToppingPromo && totalSelectedToppings >= freeToppingsLimit) {
            toast.error(`Você já selecionou o limite de ${freeToppingsLimit} adicionais grátis.`);
            return; // Impede a seleção de um novo adicional
        }

        setSelectedToppings(prev => ({
            ...prev,
            [topping.id]: !isCurrentlySelected
        }));
    };

    const handleAddToCartConfigured = () => {
        if (!selectedSize) {
            toast.error('Por favor, selecione um tamanho.');
            return;
        }

        const toppingsList = Object.entries(selectedToppings)
            .filter(([, isSelected]) => isSelected)
            .map(([id]) => {
                const toppingDetails = toppings.find(t => t.id === id);
                return { ...toppingDetails, quantity: 1 };
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

    const groupToppingsByCategory = () => toppings.reduce((acc, topping) => {
        const category = topping.category || 'Outros';
        if (!acc[category]) acc[category] = [];
        acc[category].push(topping);
        return acc;
    }, {});
    const groupedToppings = groupToppingsByCategory();

    const modalFooter = (
        <>
            <Button onClick={resetAndClose} variant="secondary">Cancelar</Button>
            <Button onClick={handleAddToCartConfigured} disabled={!settings.isStoreOpen || loadingData || !selectedSize} variant="primary">
                {loadingData ? 'Carregando...' : (settings.isStoreOpen ? `Adicionar (R$ ${currentPrice.toFixed(2).replace('.', ',')})` : 'Loja Fechada')}
            </Button>
        </>
    );

    return (
        <Modal isOpen={isOpen} onClose={resetAndClose} title={`Monte seu ${productToCustomize?.name || 'Açaí'}`} footer={modalFooter}>
            {loadingData ? <LoadingContainer>Carregando opções...</LoadingContainer> : (
                <>
                    <SectionTitle>1. Escolha o Tamanho</SectionTitle>
                    <OptionsGrid>
                        {sizes.map(size => (
                            <OptionItem key={size.id} $isSelected={selectedSize?.id === size.id} onClick={() => setSelectedSize(size)}>
                                {size.name} (+ R$ {size.price.toFixed(2).replace('.', ',')})
                            </OptionItem>
                        ))}
                    </OptionsGrid>
                    
                    <SectionTitle>
                        2. Adicionais
                        {isFreeToppingPromo && ` (${totalSelectedToppings}/${freeToppingsLimit} grátis)`}
                    </SectionTitle>
                    
                    {Object.entries(groupedToppings).map(([category, items]) => (
                        <div key={category}>
                            <ToppingCategory>{category}</ToppingCategory>
                            <OptionsGrid>
                                {items.map(topping => {
                                    const isSelected = !!selectedToppings[topping.id];
                                    const isDisabled = !isSelected && isFreeToppingPromo && totalSelectedToppings >= freeToppingsLimit;
                                    return (
                                        <OptionItem
                                            key={topping.id}
                                            $isTopping
                                            $isSelected={isSelected}
                                            onClick={isDisabled ? null : () => handleToppingToggle(topping)}
                                            style={{ cursor: isDisabled ? 'not-allowed' : 'pointer', opacity: isDisabled ? 0.6 : 1 }}
                                        >
                                            <ToppingInfo>
                                                {topping.imageUrl && <ToppingImage src={topping.imageUrl} alt={topping.name} />}
                                                <span>{topping.name} (+ R$ {topping.price.toFixed(2).replace('.', ',')})</span>
                                            </ToppingInfo>
                                            <CheckboxWrapper $isSelected={isSelected}>
                                                <input type="checkbox" checked={isSelected} readOnly />
                                            </CheckboxWrapper>
                                        </OptionItem>
                                    );
                                })}
                            </OptionsGrid>
                        </div>
                    ))}
                </>
            )}
        </Modal>
    );
};

export default AcaiCustomizationModal;