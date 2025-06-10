// src/components/PromoCard/index.js
import React from 'react';
import styled from 'styled-components';
import Button from '../Button';
import { useStoreSettings } from '../../contexts/StoreSettingsContext';

const CardWrapper = styled.div`
  background-color: #fff; border: 2px solid #7c3aed; border-radius: 12px; padding: 16px;
  width: 280px; box-shadow: 0 6px 15px rgba(124, 58, 237, 0.2);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: flex; flex-direction: column; justify-content: space-between; text-align: center;
  &:hover { transform: translateY(-5px); box-shadow: 0 8px 20px rgba(124, 58, 237, 0.3); }
`;
const CardTop = styled.div`flex-grow: 1; display: flex; flex-direction: column;`;
const CardBottom = styled.div`flex-shrink: 0;`;
const ProductImage = styled.img`width: 100%; height: 180px; object-fit: cover; border-radius: 8px; margin-bottom: 12px;`;
const PromoTitle = styled.h3`font-size: 1.5em; color: #5b21b6; margin: 0 0 8px 0; font-weight: bold;`;
const PromoDescription = styled.p`font-size: 1em; color: #333; margin: 0 0 15px 0; line-height: 1.4;`;
const PromoPrice = styled.p`font-size: 1.3em; color: #7c3aed; font-weight: bold; margin: 10px 0;`;

const PromoCard = ({ promotion, onActionClick }) => {
  const { settings } = useStoreSettings();

  if (!promotion || !promotion.product) { return null; }
  const { title, rules, product, price = 0 } = promotion;
  const description = `Ganhe ${rules.selection_limit} adicionais grátis ao personalizar!`;

  return (
    <CardWrapper>
      <CardTop>
        <ProductImage src={product.imageUrl || 'https://via.placeholder.com/280x180.png?text=Vibe+Açaí'} alt={title} />
        <PromoTitle>{title}</PromoTitle>
        <PromoDescription>{description}</PromoDescription>
      </CardTop>
      <CardBottom>
        <PromoPrice>Por apenas: R$ {price.toFixed(2).replace('.', ',')}</PromoPrice>
        <Button 
          onClick={() => onActionClick(product, promotion)}
          disabled={!settings.isStoreOpen}
        >
          {settings.isStoreOpen ? 'Aproveitar!' : 'Loja Fechada'}
        </Button>
      </CardBottom>
    </CardWrapper>
  );
};
export default PromoCard;