// src/pages/HomePage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { db } from '../../services/firebaseConfig';
import { collection, getDocs, query, where, documentId } from 'firebase/firestore';
import toast from 'react-hot-toast';
import { useStoreSettings } from '../../contexts/StoreSettingsContext';

// ▼▼▼ AQUI ESTÁ A CORREÇÃO ▼▼▼
import Button from '../../components/Button';
import ProductCard from '../../components/ProductCard';
import AcaiCustomizationModal from '../../components/AcaiCustomizationModal';
import PromoCard from '../../components/PromoCard';

// --- STYLED COMPONENTS ---
const HomePageWrapper = styled.div`padding-bottom: 50px;`;
const HeroSection = styled.div`
  width: 100%; height: 45vh; min-height: 350px; max-height: 450px;
  background-image: ${props => props.bgImage ? `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(${props.bgImage})` : 'linear-gradient(45deg, #7c3aed, #5b21b6)'};
  background-size: cover; background-position: center;
  display: flex; flex-direction: column; justify-content: center; align-items: center;
  padding: 20px;
`;
const HeroContent = styled.div`
  display: flex; flex-direction: column; align-items: center; max-width: 90%;
`;
const LogoOverlay = styled.div`
  background-color: rgba(0, 0, 0, 0.5); border-radius: 50%; padding: 20px;
  display: flex; justify-content: center; align-items: center;
  box-shadow: 0 0 20px rgba(0,0,0,0.5); margin-bottom: 20px;
  img { height: 120px; width: 120px; object-fit: contain; }
`;
const StatusInfo = styled.div`
  background-color: ${props => props.isOpen ? '#16a34a' : '#ef4444'};
  color: white; padding: 8px 20px; border-radius: 20px; font-weight: bold;
  box-shadow: 0 4px 10px rgba(0,0,0,0.2); display: flex; align-items: center; gap: 8px;
`;
const Section = styled.section`max-width: 1200px; margin: 50px auto; padding: 0 20px;`;
const SectionTitle = styled.h2`font-size: 2.2em; color: #5b21b6; text-align: center; margin-bottom: 30px;`;
const ContentGrid = styled.div`
  display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px;
  justify-items: center; align-items: stretch;
  @media (min-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 30px;
  }
`;
const LoadingText = styled.p`text-align: center; color: #555; font-style: italic; margin-top: 40px; font-size: 1.2em;`;
const Title = styled.h1`font-size: 3em; color: #7c3aed; margin-bottom: 20px;`;
// --- FIM DOS STYLED COMPONENTS ---

const HomePage = () => {
  const navigate = useNavigate();
  const { settings, loading: loadingSettings } = useStoreSettings();

  const [promotions, setPromotions] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loadingContent, setLoadingContent] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProductForCustomization, setSelectedProductForCustomization] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoadingContent(true);
      try {
        const promotionsRef = collection(db, 'promotions');
        const promoQuery = query(promotionsRef, where("isActive", "==", true));
        const promoSnapshot = await getDocs(promoQuery);
        const activePromos = promoSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        const productIdsInPromos = activePromos.map(p => p.productId || p.target?.productId).filter(Boolean);
        let productsForPromos = [];
        if (productIdsInPromos.length > 0) {
          const productsRef = collection(db, 'products');
          const productsPromoQuery = query(productsRef, where(documentId(), 'in', productIdsInPromos));
          const productsSnapshot = await getDocs(productsPromoQuery);
          productsForPromos = productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        }

        const finalPromotions = activePromos.map(promo => {
          const productId = promo.productId || promo.target?.productId;
          const productDetails = productsForPromos.find(p => p.id === productId);
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
                  <LogoOverlay>
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

            {loadingContent ? (<LoadingText>Carregando novidades...</LoadingText>) : (
              <>
                {promotions.length > 0 && (
                  <Section>
                    <SectionTitle>🔥 Promoções Imperdíveis!</SectionTitle>
                    <ContentGrid>
                      {promotions.map(promo => {
                        if (promo.type === 'product_discount' && promo.product) {
                          return (<ProductCard key={promo.id} product={promo.product} promotionalPrice={promo.promotionalPrice} onCustomize={handleOpenCustomizationModal} />);
                        }
                        if (promo.type === 'free_toppings_selection' && promo.product) {
                          return (<PromoCard key={promo.id} promotion={promo} onActionClick={(product, promoDetails) => handleOpenCustomizationModal(product, promoDetails)} />);
                        }
                        return null;
                      })}
                    </ContentGrid>
                  </Section>
                )}

                {featuredProducts.length > 0 && (
                  <Section>
                    <SectionTitle>⭐ Nossos Destaques</SectionTitle>
                    <ContentGrid>
                      {featuredProducts.map(product => {
                        const discountPromo = promotions.find(p => p.type === 'product_discount' && p.productId === product.id);
                        return (
                          <ProductCard
                            key={`featured-${product.id}`}
                            product={product}
                            promotionalPrice={discountPromo ? discountPromo.promotionalPrice : undefined}
                            onCustomize={handleOpenCustomizationModal}
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