import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { db } from '../../services/firebaseConfig';
import { doc, getDoc, collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { useCart } from '../../contexts/CartContext';
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
  SuggestedProduct,
  BackButton
} from './styles';

const ProductDetailPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [sizes, setSizes] = useState([]);
  const [toppings, setToppings] = useState([]);
  const [toppingCategories, setToppingCategories] = useState([]);
  const [selectedToppingCategory, setSelectedToppingCategory] = useState('all');
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedToppings, setSelectedToppings] = useState([]);
  const [suggestedDrinks, setSuggestedDrinks] = useState([]);
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
          const sizesRef = collection(db, 'sizes');
          const toppingsRef = collection(db, 'toppings');
          const toppingCategoriesRef = collection(db, 'toppingCategories');
          
          const [sizesSnap, toppingsSnap, toppingCategoriesSnap] = await Promise.all([
            getDocs(query(sizesRef, orderBy('price'))),
            getDocs(query(toppingsRef, orderBy('name'))),
            getDocs(query(toppingCategoriesRef, orderBy('name')))
          ]);
          
          const sizesData = sizesSnap.docs.map(d => ({ id: d.id, ...d.data() }));
          setSizes(sizesData);

          if (sizesData.length > 0) {
            setSelectedSize(sizesData[0]);
          }
          
          setToppings(toppingsSnap.docs.map(d => ({ id: d.id, ...d.data() })));
          setToppingCategories(toppingCategoriesSnap.docs.map(d => ({ id: d.id, ...d.data() })));
        } else {
          setTotalPrice(productData.price);
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
    let basePrice = 0;
    if (product.category.toLowerCase() === 'açaí') {
      basePrice = selectedSize ? selectedSize.price : 0;
    } else {
      basePrice = product.price;
    }
    
    const toppingsPrice = selectedToppings.reduce((total, topping) => total + topping.price, 0);
    const finalPrice = (basePrice + toppingsPrice) * quantity;
    setTotalPrice(finalPrice);
  }, [product, selectedSize, selectedToppings, quantity]);

  const handleToppingChange = (topping) => {
    setSelectedToppings(prev =>
      prev.some(t => t.id === topping.id)
        ? prev.filter(t => t.id !== topping.id)
        : [...prev, topping]
    );
  };
  
  const handleAddSuggestedDrink = (drink) => {
    addToCart({ ...drink, quantity: 1, id_cart: `${drink.id}-${Date.now()}` });
    toast.success(`${drink.name} adicionado ao carrinho!`);
  };

  const handleAddToCart = () => {
    if (product.category.toLowerCase() === 'açaí' && !selectedSize) {
      toast.error("Por favor, selecione um tamanho.");
      return;
    }
    const itemToAdd = {
      ...product,
      id_cart: `${product.id}-${selectedSize ? selectedSize.id : ''}-${Date.now()}`,
      quantity,
      price: totalPrice / quantity,
      selectedSize: selectedSize || null,
      selectedToppings: selectedToppings || [],
    };
    addToCart(itemToAdd);
    toast.success(`${product.name} foi adicionado ao carrinho!`);
    navigate('/menu');
  };

  if (loading) return <LoadingText>Carregando produto...</LoadingText>;
  if (!product) return <LoadingText>Produto não encontrado.</LoadingText>;

  const isAcai = product.category.toLowerCase() === 'açaí';

  return (
    <PageWrapper>
      <BackButton to="/menu">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" /></svg>
      </BackButton>
      <ProductBanner src={product.imageUrl || 'https://via.placeholder.com/1200x400'} alt={product.name} />
      <ProductContent>
        <ProductName>{product.name}</ProductName>
        <ProductDescription>{product.description}</ProductDescription>
        
        {isAcai && (
          <CustomizationSection>
            <SectionTitle>1. Escolha o Tamanho</SectionTitle>
            <OptionGroup>
              {sizes.map(size => (
                <OptionLabel key={size.id} $isActive={selectedSize?.id === size.id}>
                  <input type="radio" name="size" checked={selectedSize?.id === size.id} onChange={() => setSelectedSize(size)} />
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
              if (selectedToppingCategory !== 'all' && selectedToppingCategory !== category.name) {
                return null;
              }
              const toppingsInCategory = toppings.filter(t => t.category === category.name);
              if (toppingsInCategory.length === 0) return null;

              return (
                <div key={category.id}>
                  <ToppingCategory>{category.name}</ToppingCategory>
                  <ToppingGrid>
                    {toppingsInCategory.map(topping => (
                      <ToppingItemLabel key={topping.id}>
                        <input
                          type="checkbox"
                          checked={selectedToppings.some(t => t.id === topping.id)}
                          onChange={() => handleToppingChange(topping)}
                        />
                        <div className="custom-checkbox" />
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
        )}

        {suggestedDrinks.length > 0 && (
          <SuggestedProductsSection>
            <SectionTitle>Bebidas para acompanhar</SectionTitle>
            {suggestedDrinks.map(drink => (
              <SuggestedProduct key={drink.id}>
                <img src={drink.imageUrl || 'https://via.placeholder.com/50'} alt={drink.name} />
                <div className="info">
                  <span>{drink.name}</span>
                  <strong>R$ {drink.price.toFixed(2).replace('.', ',')}</strong>
                </div>
                <Button onClick={() => handleAddSuggestedDrink(drink)} style={{ marginLeft: 'auto', padding: '8px 12px', fontSize: '0.9em' }}>
                  Adicionar
                </Button>
              </SuggestedProduct>
            ))}
          </SuggestedProductsSection>
        )}

      </ProductContent>
      <ActionBar>
        <QuantityControl>
          <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>-</button>
          <span>{quantity}</span>
          <button onClick={() => setQuantity(q => q + 1)}>+</button>
        </QuantityControl>
        <Button onClick={handleAddToCart} disabled={loading}>
          Adicionar <TotalPrice>R$ {totalPrice.toFixed(2).replace('.', ',')}</TotalPrice>
        </Button>
      </ActionBar>
    </PageWrapper>
  );
};

export default ProductDetailPage;