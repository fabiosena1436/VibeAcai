// src/pages/HomePage/index.js

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../../services/firebaseConfig';
import { collection, getDocs, query, where, documentId } from 'firebase/firestore';
import toast from 'react-hot-toast';
import { useStoreSettings } from '../../contexts/StoreSettingsContext';
import { useCart } from '../../contexts/CartContext'; 
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, A11y } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import Button from '../../components/Button';
import ProductCard from '../../components/ProductCard';
import AcaiCustomizationModal from '../../components/AcaiCustomizationModal';
import PromoCard from '../../components/PromoCard';

import {
  HomePageWrapper,
  HeroSection,
  HeroContent,
  LogoOverlay,
  StatusInfo,
  HeroMenuButton,
  Section,
  SectionTitle,
  ContentGrid,
  LoadingText,
  Title,
  StoreClosedWarning,
  CarouselWrapper
} from './styles';

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
  };

  const handleProductAction = (product, promoDetails = null) => {
    if (!settings.isStoreOpen) {
      toast.error("A loja está fechada no momento.");
      return;
    }
    if (product.category.toLowerCase() === 'açaí' && product.hasCustomizableSizes) {
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
                <HeroMenuButton onClick={() => navigate('/menu')}>
                  Ver Cardápio
                </HeroMenuButton>
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
                        modules={[Navigation, Pagination, A11y]}
                        spaceBetween={12}
                        slidesPerView={2}
                        navigation
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
                          return (
                            <SwiperSlide key={promo.id} style={{ height: 'auto', display: 'flex' }}>
                              {(() => {
                                if (promo.type === 'product_discount' && promo.product) {
                                  // Passamos os preços da promoção diretamente para o ProductCard
                                  return <ProductCard product={promo.product} originalPrice={promo.originalPrice} promotionalPrice={promo.promotionalPrice} />;
                                }
                                if (promo.type === 'free_toppings_selection' && promo.product) {
                                  // O PromoCard já tem sua própria lógica para combos
                                  return <PromoCard promotion={promo} onActionClick={(product) => handleProductAction(product, promo)} isStoreOpen={settings.isStoreOpen} />;
                                }
                                return null;
                              })()}
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
                        // Verifica se o produto em destaque também tem uma promoção de desconto ativa
                        const discountPromo = promotions.find(p => p.type === 'product_discount' && p.productId === product.id);
                        return (
                          <ProductCard
                            key={`featured-${product.id}`}
                            product={product}
                            // Passa os preços promocionais se existirem
                            originalPrice={discountPromo ? discountPromo.originalPrice : undefined}
                            promotionalPrice={discountPromo ? discountPromo.promotionalPrice : undefined}
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
    </>
  );
};

export default HomePage;