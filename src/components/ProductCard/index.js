import React from 'react';
import Button from '../Button';
import { CardWrapper, CardImage, CardContent, ProductName, ProductDescription, PriceWrapper, OriginalPrice, PromotionalPrice } from './styles';

const ProductCard = ({ product, originalPrice, promotionalPrice, onCustomize, isStoreOpen }) => {
  const displayPrice = promotionalPrice !== undefined ? promotionalPrice : product.price;
  const isDiscountValid = promotionalPrice !== undefined && originalPrice > promotionalPrice;

  const getButtonText = () => {
    if (!isStoreOpen) {
      return 'Loja Fechada';
    }
    return product.category.toLowerCase() === 'açaí' ? 'Montar Açaí' : 'Adicionar';
  };

  const handleActionClick = (e) => {
    e.stopPropagation();
    if (onCustomize && isStoreOpen) {
      const promoDetails = isDiscountValid ? {
        type: 'product_discount',
        promotionalPrice: promotionalPrice,
        originalPrice: originalPrice,
      } : null;
      onCustomize(product, promoDetails);
    }
  };
  
  return (
    <CardWrapper onClick={handleActionClick}>
      {product.imageUrl && <CardImage src={product.imageUrl} alt={product.name} />}
      <CardContent>
        <ProductName>{product.name}</ProductName>
        <ProductDescription>{product.description}</ProductDescription>
        <PriceWrapper>
          {isDiscountValid && (
            <OriginalPrice>R$ {originalPrice.toFixed(2).replace('.', ',')}</OriginalPrice>
          )}
          <PromotionalPrice>R$ {displayPrice.toFixed(2).replace('.', ',')}</PromotionalPrice>
        </PriceWrapper>
        <Button onClick={handleActionClick} style={{ width: '100%', marginTop: 'auto' }} disabled={!isStoreOpen}>
          {getButtonText()}
        </Button>
      </CardContent>
    </CardWrapper>
  );
};

export default ProductCard;