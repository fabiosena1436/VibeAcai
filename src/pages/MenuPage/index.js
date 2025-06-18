import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../../services/firebaseConfig';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import toast from 'react-hot-toast';

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
import Footer from '../../components/Footer';

const MenuPage = () => {
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
          promoMap.set(promo.productId, promo.promotionalPrice);
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

  const filteredProducts = products.filter(product => {
    const categoryMatch = selectedCategory === 'Todos' || product.category === selectedCategory.toLowerCase();
    const searchMatch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    return categoryMatch && searchMatch;
  });

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
                        {productsInCategory.map(product => {
                          const promotionalPrice = activePromotions.get(product.id);
                          return (<ProductCard key={product.id} product={product} promotionalPrice={promotionalPrice} onCustomize={handleOpenCustomizationModal} />);
                        })}
                      </ProductListContainer>
                    </section>
                  );
                })}
              </div>
            ) : (
              <ProductListContainer>
                {filteredProducts.length > 0 ? (
                  filteredProducts.map(product => {
                    const promotionalPrice = activePromotions.get(product.id);
                    return (<ProductCard key={product.id} product={product} promotionalPrice={promotionalPrice} onCustomize={handleOpenCustomizationModal} />);
                  })
                ) : (<NoProductsText>Nenhum produto encontrado com os filtros selecionados.</NoProductsText>)}
              </ProductListContainer>
            )}
          </>
        )}
      </MenuPageWrapper>
      <AcaiCustomizationModal isOpen={isModalOpen} onClose={handleCloseCustomizationModal} productToCustomize={selectedProductForCustomization} />
      <Footer />
    </>
  );
};

export default MenuPage;