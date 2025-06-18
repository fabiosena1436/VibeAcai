import React from 'react';
import { CardWrapper, CardImage, CardContent, PromoTitle, PromoDescription, PriceInfo, ButtonStyled } from './styles';

const PromoCard = ({ promotion, onActionClick, isStoreOpen }) => {
  const { product, rules, promotionalPrice, title } = promotion;

  const handleAction = () => {
    if (onActionClick && isStoreOpen) {
      onActionClick(product, promotion);
    }
  };

  return (
    <CardWrapper>
      {product.imageUrl && <CardImage src={product.imageUrl} alt={product.name} />}
      <CardContent>
        <PromoTitle>{title}</PromoTitle>
        <PromoDescription>
          Leve <strong>{product.name}</strong> + <strong>{rules.selection_limit} adicionais</strong> da sua escolha!
        </PromoDescription>
        <PriceInfo>
          Por apenas <span>R$ {promotionalPrice?.toFixed(2).replace('.', ',')}</span>
        </PriceInfo>
        <ButtonStyled onClick={handleAction} disabled={!isStoreOpen}>
          {isStoreOpen ? 'Montar Combo' : 'Loja Fechada'}
        </ButtonStyled>
      </CardContent>
    </CardWrapper>
  );
};

export default PromoCard;