import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../../services/firebaseConfig';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import toast from 'react-hot-toast';

// --- PASSO 1: Importar o hook useCart do contexto do carrinho ---
import { useCart } from '../../contexts/CartContext'; 

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

import ProductCard from '../../components/ProductCard';
import AcaiCustomizationModal from '../../components/AcaiCustomizationModal';
import Button from '../../components/Button';

import {
  MenuPageWrapper,
  MenuHeader,
  MenuTitle,
  CategoryCarouselWrapper,
  CategoryButton,
  CategorySectionTitle,
  ProductListContainer,
  LoadingText,
  SearchContainer,
  SearchInput,
  NoProductsText
} from './styles';

const MenuPage = () => {
  // --- PASSO 1 (Continuação): Inicializar a função addToCart do hook ---
  const { addToCart } = useCart();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activePromotions, setActivePromotions] = useState(new Map());
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProductForCustomization, setSelectedProductForCustomization] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const productsRef = collection(db, 'products');
        const productsQuery = query(productsRef, where("isAvailable", "==", true));
        const categoriesRef = collection(db, 'categories');
        const categoriesQuery = query(categoriesRef, orderBy("name"));
        const promotionsRef = collection(db, 'promotions');
        const promotionsQuery = query(promotionsRef, where("isActive", "==", true), where("type", "==", "product_discount"));

        const [productsSnapshot, categoriesSnapshot, promotionsSnapshot] = await Promise.all([
          getDocs(productsQuery), getDocs(categoriesQuery), getDocs(promotionsQuery)
        ]);

        const productsData = productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProducts(productsData);

        let categoriesData = categoriesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        categoriesData.sort((a, b) => {
          const targetCategory = 'açaí';
          if (a.name.toLowerCase() === targetCategory) return -1;
          if (b.name.toLowerCase() === targetCategory) return 1;
          return a.name.localeCompare(b.name);
        });
        setCategories(categoriesData);

        const promoMap = new Map();
        promotionsSnapshot.forEach(doc => {
          const promo = doc.data();
          promoMap.set(promo.productId, { 
            promotionalPrice: promo.promotionalPrice, 
            originalPrice: promo.originalPrice, // Guardamos o preço original para referência
            title: promo.title 
          });
        });
        setActivePromotions(promoMap);
      } catch (error) {
        console.error("Erro ao buscar dados do cardápio:", error);
        toast.error("Não foi possível carregar o cardápio.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleOpenCustomizationModal = (product, promoDetails = null) => {
    const productWithContext = { ...product, appliedPromo: promoDetails };
    setSelectedProductForCustomization(productWithContext);
    setIsModalOpen(true);
  };

  const handleCloseCustomizationModal = () => {
    setIsModalOpen(false);
    setSelectedProductForCustomization(null);
  };
  
  // --- PASSO 3: Função para adicionar item que não é açaí diretamente ao carrinho ---
  /**
   * Documentação: Adiciona um produto que não requer personalização diretamente ao carrinho.
   * @param {object} product - O objeto do produto a ser adicionado.
   * @param {object | null} promoDetails - Detalhes da promoção, se aplicável.
   */
  const handleDirectAddToCart = (product, promoDetails = null) => {
    const finalPrice = promoDetails ? promoDetails.promotionalPrice : product.price;

    const cartItem = {
      ...product,
      id_cart: `${product.id}-${Date.now()}`, // Cria um ID único para o item no carrinho
      price: finalPrice,
      quantity: 1,
      appliedPromotion: promoDetails ? promoDetails.title : null, 
    };
    addToCart(cartItem);
    toast.success(`${product.name} foi adicionado ao carrinho!`);
  };

  // --- PASSO 2: Lógica unificada para decidir a ação com base na categoria ---
  /**
   * Documentação: Verifica a categoria do produto e decide a ação a ser tomada.
   * Se a categoria for 'açaí', abre o modal de personalização.
   * Caso contrário, adiciona o produto diretamente ao carrinho.
   * @param {object} product - O objeto do produto.
   * @param {object | null} promoDetails - Detalhes da promoção, se aplicável.
   */
  const handleProductAction = (product, promoDetails = null) => {
    // Verificamos a categoria do produto em minúsculas para evitar erros
    if (product.category.toLowerCase() === 'açaí') {
      handleOpenCustomizationModal(product, promoDetails);
    } else {
      handleDirectAddToCart(product, promoDetails);
    }
  };


  const filteredProducts = products.filter(product => {
    const categoryMatch = selectedCategory === 'Todos' || product.category === selectedCategory.toLowerCase();
    const searchMatch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    return categoryMatch && searchMatch;
  });
  
  /**
   * Documentação: Função auxiliar para renderizar uma lista de produtos.
   * Isso evita repetição de código na renderização principal.
   * @param {Array<object>} productList - A lista de produtos a ser renderizada.
   */
  const renderProductList = (productList) => {
    return productList.map(product => {
        const promo = activePromotions.get(product.id);
        const promoDetails = promo ? { 
            title: promo.title, 
            promotionalPrice: promo.promotionalPrice, 
            originalPrice: product.price 
        } : null;

        return (
            <ProductCard
                key={product.id}
                product={product}
                originalPrice={promo ? product.price : undefined}
                promotionalPrice={promo ? promo.promotionalPrice : undefined}
                // --- PASSO 4: Passamos a nova função de decisão para o componente ProductCard ---
                onCustomize={(product) => handleProductAction(product, promoDetails)}
            />
        );
    });
  };

  return (
    <>
      <MenuPageWrapper>
        <MenuHeader>
          <MenuTitle>Nosso Cardápio</MenuTitle>
          <Link to="/"><Button>Voltar para Home</Button></Link>
        </MenuHeader>
        {loading ? (<LoadingText>Carregando cardápio...</LoadingText>) : (
          <>
            <SearchContainer>
              <SearchInput type="text" placeholder="🔎 Buscar pelo nome do produto..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </SearchContainer>

            <CategoryCarouselWrapper>
              <Swiper slidesPerView="auto" spaceBetween={10} freeMode={true}>
                <SwiperSlide>
                  <CategoryButton $isActive={selectedCategory === 'Todos'} onClick={() => setSelectedCategory('Todos')}>Todos</CategoryButton>
                </SwiperSlide>
                {categories.map(category => (
                  <SwiperSlide key={category.id}>
                    <CategoryButton $isActive={selectedCategory === category.name} onClick={() => setSelectedCategory(category.name)}>{category.name}</CategoryButton>
                  </SwiperSlide>
                ))}
              </Swiper>
            </CategoryCarouselWrapper>

            {selectedCategory === 'Todos' && !searchTerm ? (
              <div>
                {categories.map(category => {
                  const productsInCategory = products.filter(p => p.category === category.name.toLowerCase());
                  if (productsInCategory.length === 0) return null;
                  return (
                    <section key={category.id}>
                      <CategorySectionTitle>{category.name}</CategorySectionTitle>
                      <ProductListContainer>
                        {renderProductList(productsInCategory)}
                      </ProductListContainer>
                    </section>
                  );
                })}
              </div>
            ) : (
              <ProductListContainer>
                {filteredProducts.length > 0 ? (
                    renderProductList(filteredProducts)
                ) : (<NoProductsText>Nenhum produto encontrado com os filtros selecionados.</NoProductsText>)}
              </ProductListContainer>
            )}
          </>
        )}
      </MenuPageWrapper>
      <AcaiCustomizationModal isOpen={isModalOpen} onClose={handleCloseCustomizationModal} productToCustomize={selectedProductForCustomization} />
    </>
  );
};

export default MenuPage;