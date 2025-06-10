// src/components/ProductCard/index.js
import React from 'react';
import Button from '../Button';
import styled from 'styled-components';
import { useCart } from '../../contexts/CartContext';
import { useStoreSettings } from '../../contexts/StoreSettingsContext';

const CardWrapper = styled.div`
  background-color: #fff; border: 1px solid #eee; border-radius: 12px; padding: 16px;
  width: 280px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: flex; flex-direction: column; /* Essencial para o alinhamento interno */
  &:hover { transform: translateY(-5px); box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15); }
`;
const CardTop = styled.div`
  flex-grow: 1; /* Faz esta parte crescer e ocupar o espaço, empurrando o fundo para baixo */
  display: flex;
  flex-direction: column;
  text-align: center;
`;
const CardBottom = styled.div`
  flex-shrink: 0; /* Impede que a parte de baixo encolha */
`;
const ProductImage = styled.img`width: 100%; height: 200px; object-fit: cover; border-radius: 8px; margin-bottom: 12px;`;
const ProductName = styled.h3`font-size: 1.4em; color: #333; margin: 0 0 8px 0; font-weight: 600;`;
const ProductDescription = styled.p`font-size: 0.9em; color: #666; margin: 0 0 12px 0; line-height: 1.4;`;
const PriceWrapper = styled.div`display: flex; flex-direction: column; align-items: center; justify-content: center; margin-bottom: 16px; min-height: 50px;`;
const OriginalPrice = styled.p`font-size: 0.9em; color: #999; text-decoration: line-through; margin: 0;`;
const PromotionalPrice = styled.p`font-size: 1.4em; color: #16a34a; font-weight: bold; margin: 0;`;
const RegularPrice = styled.p`font-size: 1.3em; color: #7c3aed; font-weight: bold; margin: 0;`;

const DEFAULT_IMAGE_URL = 'https://via.placeholder.com/280x200.png?text=Vibe+Açaí';

const ProductCard = ({ product, onCustomize, promotionalPrice }) => {
  const { addToCart } = useCart();
  const { settings } = useStoreSettings();
  if (!product) { return null; }

  const { name, description, imageUrl, category, price } = product;
  const isAcai = category === 'açaí';

  const handleActionClick = () => {
    const productToAdd = promotionalPrice !== undefined && promotionalPrice !== null ? { ...product, price: promotionalPrice } : product;
    if (isAcai && onCustomize) {
      onCustomize(productToAdd);
    } else {
      addToCart(productToAdd);
    }
  };

  const buttonText = isAcai ? "Personalizar" : "Adicionar ao Carrinho";

  return (
    <CardWrapper>
      <CardTop>
        <ProductImage src={imageUrl || DEFAULT_IMAGE_URL} alt={name} />
        <ProductName>{name || 'Nome do Produto'}</ProductName>
        <ProductDescription>{description || 'Descrição do produto em breve.'}</ProductDescription>
      </CardTop>
      <CardBottom>
        <PriceWrapper>
          {promotionalPrice !== undefined && promotionalPrice !== null ? (
            <>
              <OriginalPrice>de R$ {price.toFixed(2).replace('.', ',')}</OriginalPrice>
              <PromotionalPrice>por R$ {promotionalPrice.toFixed(2).replace('.', ',')}</PromotionalPrice>
            </>
          ) : (
            <RegularPrice>R$ {price ? price.toFixed(2).replace('.', ',') : '0,00'}</RegularPrice>
          )}
        </PriceWrapper>
        <Button onClick={handleActionClick} disabled={!settings.isStoreOpen}>
          {settings.isStoreOpen ? buttonText : "Loja Fechada"}
        </Button>
      </CardBottom>
    </CardWrapper>
  );
};

export default ProductCard;