// src/components/ProductCard/index.js

import React from 'react';
import { useNavigate } from 'react-router-dom';
// NOVO: Importamos o estilo OldPrice para o preço antigo
import { CardWrapper, ProductImage, ProductInfo, ProductName, ProductPrice, PricePrefix, OldPrice } from './styles';

// ALTERADO: Adicionamos `promotionalPrice` e `originalPrice` como props
const ProductCard = ({ product, promotionalPrice, originalPrice }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/produto/${product.id}`);
  };

  // LÓGICA ALTERADA: Esta função agora lida com preços promocionais
  const getDisplayPrice = () => {
    // Se um preço promocional for fornecido, ele tem prioridade
    if (typeof promotionalPrice === 'number') {
      return (
        <>
          {/* Mostra o preço original riscado, se ele existir */}
          {typeof originalPrice === 'number' && (
            <OldPrice>
              R$ {originalPrice.toFixed(2).replace('.', ',')}
            </OldPrice>
          )}
          {/* Exibe o preço da promoção */}
          <span>R$ {promotionalPrice.toFixed(2).replace('.', ',')}</span>
        </>
      );
    }
    
    // Lógica original para produtos com vários tamanhos (açaí)
    if (product.hasCustomizableSizes && product.availableSizes?.length > 0) {
      const minPrice = Math.min(...product.availableSizes.map(size => size.price));
      return (
        <>
          <PricePrefix>A partir de</PricePrefix>
          R$ {minPrice.toFixed(2).replace('.', ',')}
        </>
      );
    }
    
    // Retorna o preço padrão se não houver promoção ou tamanhos customizáveis
    return `R$ ${product.price.toFixed(2).replace('.', ',')}`;
  };

  return (
    <CardWrapper onClick={handleCardClick}>
      <ProductImage src={product.imageUrl || 'https://via.placeholder.com/300'} alt={product.name} />
      <ProductInfo>
        <ProductName>{product.name}</ProductName>
        {/* Chamamos a função atualizada para exibir o preço correto */}
        <ProductPrice>{getDisplayPrice()}</ProductPrice>
      </ProductInfo>
    </CardWrapper>
  );
};

export default ProductCard;