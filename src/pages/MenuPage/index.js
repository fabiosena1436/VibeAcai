import React, { useState, useEffect } from 'react';
import { db } from '../../services/firebaseConfig';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import toast from 'react-hot-toast';
import { useStoreSettings } from '../../contexts/StoreSettingsContext'; 
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import ProductListItem from '../../components/ProductListItem';

// --- ALTERADO --- Importamos o novo estilo e removemos o styled daqui
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
  NoProductsText,
  StoreClosedWarning // <-- Novo estilo importado
} from './styles';

const MenuPage = () => {
  // --- NOVO --- Obtendo as configurações da loja
  const { settings, loading: loadingSettings } = useStoreSettings();
  
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const productsRef = collection(db, 'products');
        const productsQuery = query(productsRef, where("isAvailable", "==", true));
        const categoriesRef = collection(db, 'categories');
        const categoriesQuery = query(categoriesRef, orderBy("name"));

        const [productsSnapshot, categoriesSnapshot] = await Promise.all([
          getDocs(productsQuery), getDocs(categoriesQuery)
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
      } catch (error) {
        console.error("Erro ao buscar dados do cardápio:", error);
        toast.error("Não foi possível carregar o cardápio.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // --- ALTERADO --- Lógica de busca aprimorada
  const filteredProducts = products.filter(product => {
    const categoryMatch = selectedCategory === 'Todos' || product.category.toLowerCase() === selectedCategory.toLowerCase();
    
    // Normaliza os textos para busca (remove acentos e converte para minúsculas)
    const normalizedSearchTerm = searchTerm.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    const normalizedProductName = product.name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    
    const searchMatch = normalizedProductName.includes(normalizedSearchTerm);
    
    return categoryMatch && searchMatch;
  });

  const renderProductList = (productList) => {
    return productList.map(product => (
      <ProductListItem key={product.id} product={product} />
    ));
  };
  
  // --- ALTERADO --- Espera pelas configurações da loja também
  if (loading || loadingSettings) {
    return <LoadingText>Carregando cardápio...</LoadingText>;
  }

  return (
    <MenuPageWrapper>
      <MenuHeader>
        <MenuTitle>Nosso Cardápio</MenuTitle>
      </MenuHeader>

      {/* --- NOVO --- Renderização condicional do aviso de loja fechada */}
      {!settings.isStoreOpen && settings.openingHoursText && (
        <StoreClosedWarning>
          <h3>Ops! Estamos Fechados</h3>
          <p>Nosso delivery não está funcionando no momento.</p>
          <p><strong>Nosso horário é:</strong><br/>{settings.openingHoursText}</p>
        </StoreClosedWarning>
      )}

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
              <CategoryButton $isActive={selectedCategory.toLowerCase() === category.name.toLowerCase()} onClick={() => setSelectedCategory(category.name)}>{category.name}</CategoryButton>
            </SwiperSlide>
          ))}
        </Swiper>
      </CategoryCarouselWrapper>
      
      {selectedCategory === 'Todos' && !searchTerm ? (
        <>
          {categories.map(category => {
            const productsInCategory = products.filter(p => p.category.toLowerCase() === category.name.toLowerCase());
            if (productsInCategory.length === 0) return null;
            return (
              <section key={category.id} style={{width: '100%'}}>
                <CategorySectionTitle>{category.name}</CategorySectionTitle>
                <ProductListContainer>
                  {renderProductList(productsInCategory)}
                </ProductListContainer>
              </section>
            );
          })}
        </>
      ) : (
        
        <ProductListContainer>
          {filteredProducts.length > 0 ? (
            renderProductList(filteredProducts)
          ) : (<NoProductsText>Nenhum produto encontrado.</NoProductsText>)}
        </ProductListContainer>
      )}
    </MenuPageWrapper>
  );
};

export default MenuPage;