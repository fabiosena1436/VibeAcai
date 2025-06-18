import React from 'react';
import Button from '../Button';
import { CardWrapper, CardImage, CardContent, ProductName, ProductDescription, PriceWrapper, OriginalPrice, PromotionalPrice } from './styles';

const ProductCard = ({ product, originalPrice, promotionalPrice, onCustomize }) => {
  // Define o preço que será exibido em destaque. Se houver preço promocional, usa ele.
  const displayPrice = promotionalPrice !== undefined ? promotionalPrice : product.price;

  // Verifica se a promoção é válida (preço promocional menor que o original)
  const isDiscountValid = promotionalPrice !== undefined && originalPrice > promotionalPrice;

  const handleCustomizeClick = (e) => {
    e.stopPropagation();
    if (onCustomize) {
      // Informa ao modal de customização que existe uma promoção de desconto aplicada
      const promoDetails = isDiscountValid ? {
        type: 'product_discount',
        promotionalPrice: promotionalPrice,
        originalPrice: originalPrice,
      } : null;
      onCustomize(product, promoDetails);
    }
  };
  
  return (
    <CardWrapper onClick={handleCustomizeClick}>
      {product.imageUrl && <CardImage src={product.imageUrl} alt={product.name} />}
      <CardContent>
        <ProductName>{product.name}</ProductName>
        <ProductDescription>{product.description}</ProductDescription>
        <PriceWrapper>
          {/* Mostra o preço original riscado apenas se a promoção for válida */}
          {isDiscountValid && (
            <OriginalPrice>R$ {originalPrice.toFixed(2).replace('.', ',')}</OriginalPrice>
          )}
          <PromotionalPrice>R$ {displayPrice.toFixed(2).replace('.', ',')}</PromotionalPrice>
        </PriceWrapper>
        <Button onClick={handleCustomizeClick} style={{ width: '100%', marginTop: 'auto' }}>
          {product.category === 'açaí' ? 'Montar Açaí' : 'Adicionar'}
        </Button>
      </CardContent>
    </CardWrapper>
  );
};

export default ProductCard;