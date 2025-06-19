import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { db } from '../../services/firebaseConfig';
import { collection, getDocs, query, where, documentId } from 'firebase/firestore';
import toast from 'react-hot-toast';
import { useStoreSettings } from '../../contexts/StoreSettingsContext';
import { useCart } from '../../contexts/CartContext'; 
// MUDANÇA: Módulo 'Pagination' foi adicionado de volta
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, A11y } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
// MUDANÇA: CSS da paginação foi adicionado de volta
import 'swiper/css/pagination';

import Button from '../../components/Button';
import ProductCard from '../../components/ProductCard';
import AcaiCustomizationModal from '../../components/AcaiCustomizationModal';
import PromoCard from '../../components/PromoCard';
import Footer from '../../components/Footer';

const HomePageWrapper = styled.div`padding-bottom: 50px;`;
const HeroSection = styled.div`
  width: 100%; height: 45vh; min-height: 350px; max-height: 450px;
  background-image: ${props => props.bgImage ? `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(${props.bgImage})` : 'linear-gradient(45deg, #7c3aed, #5b21b6)'};
  background-size: cover; background-position: center;
  display: flex; flex-direction: column; justify-content: center; align-items: center;
  padding: 20px;

  @media (max-width: 768px) {
    min-height: 300px;
    height: 40vh;
  }
`;
const HeroContent = styled.div`
  display: flex; flex-direction: column; align-items: center; max-width: 90%;
`;
const LogoOverlay = styled.div`
  background-color: rgb(247 241 241 / 76%); border-radius: 50%; padding: 20px;
  display: flex; justify-content: center; align-items: center;
  box-shadow: 0 0 20px rgba(0,0,0,0.5); margin-bottom: 20px;
  img { height: 120px; width: 120px; object-fit: contain; }
  
  @media (max-width: 768px) {
    padding: 15px;
    img {
        height: 100px;
        width: 100px;
    }
  }
`;
const StatusInfo = styled.div`
  background-color: ${props => props.isOpen ? '#16a34a' : '#ef4444'};
  color: white; padding: 8px 20px; border-radius: 20px; font-weight: bold;
  box-shadow: 0 4px 10px rgba(0,0,0,0.2); display: flex; align-items: center; gap: 8px;
`;
const Section = styled.section`
    max-width: 1200px; margin: 50px auto; padding: 0 20px;
    @media (max-width: 768px) {
        padding: 0 15px;
    }
`;
const SectionTitle = styled.h2`
    font-size: 2.2em; color: #5b21b6; text-align: center; margin-bottom: 30px;
    @media (max-width: 768px) {
        font-size: 1.8em;
    }
`;
const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  justify-items: center;
  align-items: stretch;

  @media (min-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 30px;
  }
`;
const LoadingText = styled.p`text-align: center; color: #555; font-style: italic; margin-top: 40px; font-size: 1.2em;`;
const Title = styled.h1`
    font-size: 3em; color: #7c3aed; margin-bottom: 20px;
    @media (max-width: 768px) {
        font-size: 2.2em;
    }
`;
const StoreClosedWarning = styled.div`
  background-color: #fffbe6; color: #92400e;
  border: 1px solid #fde68a; border-radius: 8px; padding: 16px;
  margin: -20px auto 40px auto; max-width: 1160px; text-align: center;
  box-shadow: 0 4px 10px rgba(0,0,0,0.05);
  h3 { margin-top: 0; font-size: 1.4em; color: #b45309; }
  p { margin: 5px 0 0 0; white-space: pre-wrap; }
`;

// MUDANÇA: Estilos e padding da paginação foram restaurados


const CarouselWrapper = styled.div`
  position: relative;
  // Padding horizontal para que as setas não fiquem coladas nas bordas em telas maiores
  padding: 0 10px;

  // MUDANÇA: Aplicamos um padding inferior diretamente no container do swiper.
  // Isso cria o espaço necessário ABAIXO dos cards.
  .swiper {
    padding-bottom: 40px;
  }

  .swiper-button-next,
  .swiper-button-prev {
    color: #5b21b6;
    transition: transform 0.2s ease;
    
    &:hover {
      transform: scale(1.1);
    }

    @media (max-width: 768px) {
      display: none;
    }
  }

  // MUDANÇA: Ajustamos a posição da paginação para ficar dentro do novo espaço.
  .swiper-pagination {
    position: absolute;
    bottom: 8px; // Posição mais baixa, dentro da área de 40px
    left: 0;
    width: 100%;
  }

  .swiper-pagination-bullet {
    background: #a78bfa;
    width: 10px;
    height: 10px;
    opacity: 0.7;
  }

  .swiper-pagination-bullet-active {
    background: #5b21b6;
    opacity: 1;
  }
  
  // No celular, removemos o padding lateral do wrapper, pois as setas não existem
  @media (max-width: 768px) {
    padding: 0 5px;
  }
`;


const HomePage = () => {
  const navigate = useNavigate();
  const { settings, loading: loadingSettings } = useStoreSettings();
  const { addToCart } = useCart();
  const [promotions, setPromotions] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loadingContent, setLoadingContent] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProductForCustomization, setSelectedProductForCustomization] = useState(null);
  const [logoClickCount, setLogoClickCount] = useState(0);
  const clickTimeoutRef = useRef(null);
  const REQUIRED_CLICKS = 5;

  const handleLogoClick = () => {
    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
    }
    const newClickCount = logoClickCount + 1;
    setLogoClickCount(newClickCount);
    if (newClickCount >= REQUIRED_CLICKS) {
      toast.success('Acesso secreto liberado!');
      navigate('/admin/login');
      setLogoClickCount(0);
    } else {
      clickTimeoutRef.current = setTimeout(() => {
        setLogoClickCount(0);
      }, 2000);
    }
  };

  useEffect(() => {
    return () => {
      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoadingContent(true);
      try {
        const promotionsRef = collection(db, 'promotions');
        const promoQuery = query(promotionsRef, where("isActive", "==", true));
        const promoSnapshot = await getDocs(promoQuery);
        const activePromos = promoSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        const productIdsInPromos = activePromos.map(p => p.productId).filter(Boolean);
        let productsForPromos = [];
        if (productIdsInPromos.length > 0) {
          const productsRef = collection(db, 'products');
          const productsPromoQuery = query(productsRef, where(documentId(), 'in', productIdsInPromos));
          const productsSnapshot = await getDocs(productsPromoQuery);
          productsForPromos = productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        }

        const finalPromotions = activePromos.map(promo => {
          const productDetails = productsForPromos.find(p => p.id === promo.productId);
          return (productDetails && productDetails.isAvailable) ? { ...promo, product: productDetails } : null;
        }).filter(Boolean);
        setPromotions(finalPromotions);

        const productsRef = collection(db, 'products');
        const featuredQuery = query(productsRef, where("isFeatured", "==", true), where("isAvailable", "==", true));
        const featuredSnapshot = await getDocs(featuredQuery);
        setFeaturedProducts(featuredSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

      } catch (error) {
        console.error("ERRO AO BUSCAR DADOS DA HOME:", error);
        toast.error("Não foi possível carregar as novidades.");
      } finally {
        setLoadingContent(false);
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

  const handleDirectAddToCart = (product, promoDetails = null) => {
    const finalPrice = promoDetails ? promoDetails.promotionalPrice : product.price;

    const cartItem = {
      ...product,
      id_cart: `${product.id}-${Date.now()}`,
      price: finalPrice,
      quantity: 1,
      appliedPromotion: promoDetails ? promoDetails.title : null,
    };
    addToCart(cartItem);
    toast.success(`${product.name} foi adicionado ao carrinho!`);
  };

  const handleProductAction = (product, promoDetails = null) => {
    if (!settings.isStoreOpen) {
      toast.error("A loja está fechada no momento.");
      return;
    }
    if (product.category.toLowerCase() === 'açaí') {
      handleOpenCustomizationModal(product, promoDetails);
    } else {
      handleDirectAddToCart(product, promoDetails);
    }
  };

  return (
    <>
      <HomePageWrapper>
        {loadingSettings ? (
          <LoadingText>Carregando loja...</LoadingText>
        ) : (
          <>
            <HeroSection bgImage={settings.bannerUrl}>
              <HeroContent>
                {settings.logoUrl ? (
                  <LogoOverlay onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
                    <img src={settings.logoUrl} alt="Vibe Açaí" />
                  </LogoOverlay>
                ) : (
                  <Title style={{ color: 'white', textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>Vibe Açaí</Title>
                )}
                <StatusInfo isOpen={settings.isStoreOpen}>
                  {settings.isStoreOpen ? '● Loja Aberta' : '● Loja Fechada'}
                </StatusInfo>
              </HeroContent>
            </HeroSection>

            {!settings.isStoreOpen && settings.openingHoursText && (
              <StoreClosedWarning>
                <h3>Ops! Estamos Fechados</h3>
                <p>Nosso delivery não está funcionando no momento.</p>
                <p><strong>Nosso horário é:</strong><br/>{settings.openingHoursText}</p>
              </StoreClosedWarning>
            )}

            {loadingContent ? (<LoadingText>Carregando novidades...</LoadingText>) : (
              <>
                {promotions.length > 0 && (
                  <Section>
                    <SectionTitle>🔥 Promoções Imperdíveis!</SectionTitle>
                    <CarouselWrapper>
                      <Swiper
                        // MUDANÇA: Módulo Pagination adicionado de volta
                        modules={[Navigation, Pagination, A11y]}
                        spaceBetween={12}
                        slidesPerView={2}
                        navigation
                        // MUDANÇA: Propriedade pagination adicionada de volta
                        pagination={{ clickable: true }}
                        breakpoints={{
                          768: {
                            slidesPerView: 3,
                            spaceBetween: 20,
                          },
                          1024: {
                            slidesPerView: promotions.length > 3 ? 4 : 3,
                            spaceBetween: 30,
                          },
                        }}
                      >
                        {promotions.map(promo => {
                          const promoDetails = { title: promo.title, promotionalPrice: promo.promotionalPrice, originalPrice: promo.originalPrice };
                          return (
                            <SwiperSlide key={promo.id} style={{ height: 'auto', display: 'flex' }}>
                               {
                                 (() => {
                                    if (promo.type === 'product_discount' && promo.product) {
                                        return <ProductCard product={promo.product} originalPrice={promo.originalPrice} promotionalPrice={promo.promotionalPrice} onCustomize={(product) => handleProductAction(product, promoDetails)} isStoreOpen={settings.isStoreOpen} />;
                                    }
                                    if (promo.type === 'free_toppings_selection' && promo.product) {
                                        return <PromoCard promotion={promo} onActionClick={(product) => handleProductAction(product, promo)} isStoreOpen={settings.isStoreOpen} />;
                                    }
                                    return null;
                                 })()
                               }
                            </SwiperSlide>
                          );
                        })}
                      </Swiper>
                    </CarouselWrapper>
                  </Section>
                )}

                {featuredProducts.length > 0 && (
                  <Section>
                    <SectionTitle>⭐ Nossos Destaques</SectionTitle>
                    <ContentGrid>
                      {featuredProducts.map(product => {
                        const discountPromo = promotions.find(p => p.type === 'product_discount' && p.productId === product.id);
                        const promoDetails = discountPromo ? { title: discountPromo.title, promotionalPrice: discountPromo.promotionalPrice, originalPrice: discountPromo.originalPrice } : null;
                        return (
                          <ProductCard
                            key={`featured-${product.id}`}
                            product={product}
                            originalPrice={discountPromo ? discountPromo.originalPrice : undefined}
                            promotionalPrice={discountPromo ? discountPromo.promotionalPrice : undefined}
                            onCustomize={(product) => handleProductAction(product, promoDetails)}
                            isStoreOpen={settings.isStoreOpen}
                          />
                        );
                      })}
                    </ContentGrid>
                  </Section>
                )}

                {!loadingContent && promotions.length === 0 && featuredProducts.length === 0 && (
                  <Section style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: '1.2em', color: '#666' }}>Fique de olho! Em breve teremos novidades e promoções especiais para você.</p>
                    <Button onClick={() => navigate('/menu')}>Ver Cardápio Completo</Button>
                  </Section>
                )}
              </>
            )}
          </>
        )}
      </HomePageWrapper>
      <AcaiCustomizationModal isOpen={isModalOpen} onClose={handleCloseCustomizationModal} productToCustomize={selectedProductForCustomization} />
      <Footer />
    </>
  );
};

export default HomePage;