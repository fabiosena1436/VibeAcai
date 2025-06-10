import React from 'react';
import {
  PromoCardContainer,
  PromoImage,
  PromoTitle,
  PromoDescription,
  PromoPrice,
} from './styles';
import Button from '../Button';

const PromoCard = ({ promotion, onAddToCart }) => {
  // Verificação de segurança: garante que a promoção e o preço promocional existem
  if (!promotion || typeof promotion.promotionalPrice !== 'number') {
    // Não renderiza nada ou pode renderizar uma mensagem de erro se preferir
    // Isto evita que a aplicação quebre.
    console.error("PromoCard recebeu uma promoção inválida:", promotion);
    return null; 
  }

  const { title, description, imageUrl, originalPrice, promotionalPrice } = promotion;

  return (
    <PromoCardContainer>
      <PromoImage src={imageUrl} alt={title} />
      <PromoTitle>{title}</PromoTitle>
      <PromoDescription>{description}</PromoDescription>
      <PromoPrice>
        {/* Adiciona uma verificação para garantir que originalPrice também é um número antes de o mostrar */}
        {originalPrice && typeof originalPrice === 'number' && (
          <span>R$ {originalPrice.toFixed(2)}</span>
        )}
        <strong>R$ {promotionalPrice.toFixed(2)}</strong>
      </PromoPrice>
      <Button onClick={() => onAddToCart(promotion)}>Adicionar ao Carrinho</Button>
    </PromoCardContainer>
  );
};

export default PromoCard;