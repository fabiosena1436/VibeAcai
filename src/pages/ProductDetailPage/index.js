import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../../services/firebaseConfig';
import { doc, getDoc, collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { useCart } from '../../contexts/CartContext';
import { useStoreSettings } from '../../contexts/StoreSettingsContext';
import toast from 'react-hot-toast';
import Button from '../../components/Button';
import {
  PageWrapper,
  LoadingText,
  ProductBanner,
  ProductContent,
  ProductName,
  ProductDescription,
  CustomizationSection,
  SectionTitle,
  OptionGroup,
  OptionLabel,
  ToppingCategory,
  ToppingGrid,
  ToppingItemLabel,
  ToppingInfo,
  ActionBar,
  QuantityControl,
  TotalPrice,
  CategoryFilterContainer,
  CategoryFilterButton,
  SuggestedProductsSection,
  SuggestedProductLabel,
  BackButton,
  ToppingImage // <-- Importa o novo componente de imagem
} from './styles';

const ProductDetailPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { settings, loading: loadingSettings } = useStoreSettings();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [sizes, setSizes] = useState([]);
  const [toppings, setToppings] = useState([]);
  const [toppingCategories, setToppingCategories] = useState([]);
  const [selectedToppingCategory, setSelectedToppingCategory] = useState('all');
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedToppings, setSelectedToppings] = useState([]);
  
  const [suggestedDrinks, setSuggestedDrinks] = useState([]);
  const [selectedDrinks, setSelectedDrinks] = useState([]);

  const [quantity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const productRef = doc(db, 'products', productId);
        const productSnap = await getDoc(productRef);

        if (!productSnap.exists()) {
          toast.error("Produto não encontrado.");
          navigate('/menu');
          return;
        }

        const productData = { id: productSnap.id, ...productSnap.data() };
        setProduct(productData);

        if (productData.category.toLowerCase() !== 'bebidas') {
          const drinksQuery = query(collection(db, 'products'), where('category', '==', 'bebidas'), where('isAvailable', '==', true));
          const drinksSnap = await getDocs(drinksQuery);
          setSuggestedDrinks(drinksSnap.docs.map(d => ({ id: d.id, ...d.data() })));
        }

        if (productData.category.toLowerCase() === 'açaí') {
          if (productData.hasCustomizableSizes && productData.availableSizes) {
            const sizesData = productData.availableSizes.sort((a, b) => a.price - b.price);
            setSizes(sizesData);
            if (sizesData.length > 0) {
              setSelectedSize(sizesData[0]);
            }
          }
          
          const toppingsRef = collection(db, 'toppings');
          const toppingCategoriesRef = collection(db, 'toppingCategories');
          
          const [toppingsSnap, toppingCategoriesSnap] = await Promise.all([
            getDocs(query(toppingsRef, orderBy('name'))),
            getDocs(query(toppingCategoriesRef, orderBy('name')))
          ]);
          
          setToppings(toppingsSnap.docs.map(d => ({ id: d.id, ...d.data() })));
          setToppingCategories(toppingCategoriesSnap.docs.map(d => ({ id: d.id, ...d.data() })));
        }
      } catch (error) {
        console.error("Erro ao buscar detalhes do produto:", error);
        toast.error("Erro ao carregar o produto.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [productId, navigate]);
  
  useEffect(() => {
    if (!product) return;
    
    let mainProductPrice = 0;
    if (product.hasCustomizableSizes) {
      const basePrice = selectedSize ? selectedSize.price : 0;
      const toppingsPrice = selectedToppings.reduce((total, topping) => total + topping.price, 0);
      mainProductPrice = (basePrice + toppingsPrice) * quantity;
    } else {
      mainProductPrice = product.price * quantity;
    }

    const drinksTotalPrice = selectedDrinks.reduce((total, drink) => total + drink.price, 0);
    setTotalPrice(mainProductPrice + drinksTotalPrice);

  }, [product, selectedSize, selectedToppings, quantity, selectedDrinks]);

  const handleToppingChange = (topping) => {
    setSelectedToppings(prev =>
      prev.some(t => t.id === topping.id)
        ? prev.filter(t => t.id !== topping.id)
        : [...prev, topping]
    );
  };
  
  const handleDrinkSelectionChange = (drink) => {
    setSelectedDrinks(prev =>
      prev.some(d => d.id === drink.id)
        ? prev.filter(d => d.id !== drink.id)
        : [...prev, drink]
    );
  };

  const handleAddToCart = () => {
    if (!settings.isStoreOpen) {
      toast.error("A loja está fechada e não é possível adicionar itens.");
      return;
    }

    if (product.hasCustomizableSizes && !selectedSize) {
      toast.error("Por favor, selecione um tamanho.");
      return;
    }

    let mainItemPricePerUnit = 0;
    if (product.hasCustomizableSizes) {
      const basePrice = selectedSize ? selectedSize.price : 0;
      const toppingsPrice = selectedToppings.reduce((total, topping) => total + topping.price, 0);
      mainItemPricePerUnit = basePrice + toppingsPrice;
    } else {
      mainItemPricePerUnit = product.price;
    }
    
    const mainItemToAdd = {
      ...product,
      id_cart: `${product.id}-${selectedSize ? selectedSize.name : ''}-${Date.now()}`,
      quantity,
      price: mainItemPricePerUnit,
      selectedSize: selectedSize || null,
      selectedToppings: selectedToppings || [],
    };
    addToCart(mainItemToAdd);
    
    if (selectedDrinks.length > 0) {
      selectedDrinks.forEach(drink => {
        addToCart({ ...drink, quantity: 1, id_cart: `${drink.id}-${Date.now()}` });
      });
    }

    toast.success('Itens adicionados com sucesso!');
    navigate('/menu');
  };

  if (loading || loadingSettings) return <LoadingText>Carregando produto...</LoadingText>;
  if (!product) return <LoadingText>Produto não encontrado.</LoadingText>;

  const isAcaiWithSizes = product.category.toLowerCase() === 'açaí' && product.hasCustomizableSizes;

  return (
    <PageWrapper>
      <BackButton to="/menu">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" /></svg>
      </BackButton>
      <ProductBanner src={product.imageUrl || 'https://via.placeholder.com/1200x400'} alt={product.name} />
      <ProductContent>
        <ProductName>{product.name}</ProductName>
        <ProductDescription>{product.description}</ProductDescription>
        
        {isAcaiWithSizes ? (
          <CustomizationSection>
            <SectionTitle>1. Escolha o Tamanho</SectionTitle>
            <OptionGroup>
              {sizes.map(size => (
                <OptionLabel key={size.name} $isActive={selectedSize?.name === size.name}>
                  <input type="radio" name="size" checked={selectedSize?.name === size.name} onChange={() => setSelectedSize(size)} />
                  {size.name} - R$ {size.price.toFixed(2).replace('.', ',')}
                </OptionLabel>
              ))}
            </OptionGroup>
            
            <SectionTitle>2. Adicionais (Opcional)</SectionTitle>
            
            <CategoryFilterContainer>
              <CategoryFilterButton $isActive={selectedToppingCategory === 'all'} onClick={() => setSelectedToppingCategory('all')}>
                Todos
              </CategoryFilterButton>
              {toppingCategories.map(cat => (
                <CategoryFilterButton key={cat.id} $isActive={selectedToppingCategory === cat.name} onClick={() => setSelectedToppingCategory(cat.name)}>
                  {cat.name}
                </CategoryFilterButton>
              ))}
            </CategoryFilterContainer>

            {toppingCategories.map(category => {
              if (selectedToppingCategory !== 'all' && selectedToppingCategory !== category.name) return null;
              const toppingsInCategory = toppings.filter(t => t.category === category.name);
              if (toppingsInCategory.length === 0) return null;

              return (
                <div key={category.id}>
                  <ToppingCategory>{category.name}</ToppingCategory>
                  <ToppingGrid>
                    {toppingsInCategory.map(topping => (
                      <ToppingItemLabel key={topping.id}>
                        <input type="checkbox" checked={selectedToppings.some(t => t.id === topping.id)} onChange={() => handleToppingChange(topping)} />
                        <div className="custom-checkbox" />
                        
                        {/* ## MUDANÇA PRINCIPAL (Lógica) ##
                           - Adicionamos a imagem do adicional (topping).
                           - Usamos uma imagem padrão caso a URL não exista.
                        */}
                        <ToppingImage src={topping.imageUrl || 'https://via.placeholder.com/50x50.png?text=Item'} alt={topping.name} />

                        <ToppingInfo>
                          <span>{topping.name}</span>
                          <strong>+ R$ {topping.price.toFixed(2).replace('.', ',')}</strong>
                        </ToppingInfo>
                      </ToppingItemLabel>
                    ))}
                  </ToppingGrid>
                </div>
              );
            })}
          </CustomizationSection>
        ) : (
          product.category.toLowerCase() === 'açaí' ? (
            <SectionTitle>Preço Fixo: R$ {product.price.toFixed(2).replace('.', ',')}</SectionTitle>
          ) : null
        )}
        
        {suggestedDrinks.length > 0 && (
          <SuggestedProductsSection>
            <SectionTitle>Bebidas para acompanhar</SectionTitle>
            {suggestedDrinks.map(drink => (
              <SuggestedProductLabel key={drink.id}>
                <input type="checkbox" checked={selectedDrinks.some(d => d.id === drink.id)} onChange={() => handleDrinkSelectionChange(drink)} />
                <div className="custom-checkbox" />
                <img src={drink.imageUrl || 'https://via.placeholder.com/50'} alt={drink.name} />
                <div className="info">
                  <span>{drink.name}</span>
                  <strong>R$ {drink.price.toFixed(2).replace('.', ',')}</strong>
                </div>
              </SuggestedProductLabel>
            ))}
          </SuggestedProductsSection>
        )}

      </ProductContent>
      <ActionBar>
        <QuantityControl>
          <button onClick={() => setQuantity(q => Math.max(1, q - 1))} disabled={!settings.isStoreOpen}>-</button>
          <span>{quantity}</span>
          <button onClick={() => setQuantity(q => q + 1)} disabled={!settings.isStoreOpen}>+</button>
        </QuantityControl>
        
        <Button onClick={handleAddToCart} disabled={loading || loadingSettings || !settings.isStoreOpen}>
          {settings.isStoreOpen 
            ? <>Adicionar <TotalPrice>R$ {totalPrice.toFixed(2).replace('.', ',')}</TotalPrice></>
            : 'Loja Fechada'
          }
        </Button>
      </ActionBar>
    </PageWrapper>
  );
};

export default ProductDetailPage;