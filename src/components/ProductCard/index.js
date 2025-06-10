import React from 'react';
import Button from '../Button';
import styled from 'styled-components';
import { useCart } from '../../contexts/CartContext';
import { useStoreSettings } from '../../contexts/StoreSettingsContext';

// --- ESTILOS COM RESPONSIVIDADE COMPLETA ---

const CardWrapper = styled.div`
  background-color: #fff;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow: hidden;
  height: 100%;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  /* Mobile muito pequeno (até 360px) */
  @media (max-width: 360px) {
    border-radius: 6px;
  }
`;

const ProductImage = styled.img`
  width: 100%;
  object-fit: cover;
  
  /* Mobile muito pequeno (até 360px) */
  @media (max-width: 360px) {
    height: 120px;
  }
  
  /* Mobile (361px - 480px) */
  @media (min-width: 361px) and (max-width: 480px) {
    height: 140px;
  }
  
  /* Tablet (481px - 768px) */
  @media (min-width: 481px) and (max-width: 768px) {
    height: 180px;
  }
  
  /* Desktop pequeno (769px - 1024px) */
  @media (min-width: 769px) and (max-width: 1024px) {
    height: 200px;
  }
  
  /* Desktop (1025px+) */
  @media (min-width: 1025px) {
    height: 220px;
  }
`;

const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  text-align: left;
  
  /* Mobile muito pequeno (até 360px) */
  @media (max-width: 360px) {
    padding: 8px;
  }
  
  /* Mobile (361px - 480px) */
  @media (min-width: 361px) and (max-width: 480px) {
    padding: 10px;
  }
  
  /* Tablet e maiores (481px+) */
  @media (min-width: 481px) {
    padding: 12px;
  }
`;

const ProductName = styled.h3`
  font-weight: 700;
  color: #333;
  margin: 0 0 4px 0;
  text-transform: uppercase;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  
  /* Mobile muito pequeno (até 360px) */
  @media (max-width: 360px) {
    font-size: 0.8em;
  }
  
  /* Mobile (361px - 480px) */
  @media (min-width: 361px) and (max-width: 480px) {
    font-size: 0.85em;
  }
  
  /* Tablet (481px - 768px) */
  @media (min-width: 481px) and (max-width: 768px) {
    font-size: 0.9em;
  }
  
  /* Desktop pequeno (769px - 1024px) */
  @media (min-width: 769px) and (max-width: 1024px) {
    font-size: 0.95em;
  }
  
  /* Desktop (1025px+) */
  @media (min-width: 1025px) {
    font-size: 1em;
  }
`;

const ProductDescription = styled.p`
  color: #777;
  line-height: 1.4;
  flex-grow: 1;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  
  /* Mobile muito pequeno (até 360px) */
  @media (max-width: 360px) {
    font-size: 0.7em;
    margin: 0 0 8px 0;
    min-height: 28px;
    -webkit-line-clamp: 2;
  }
  
  /* Mobile (361px - 480px) */
  @media (min-width: 361px) and (max-width: 480px) {
    font-size: 0.75em;
    margin: 0 0 10px 0;
    min-height: 32px;
  }
  
  /* Tablet (481px - 768px) */
  @media (min-width: 481px) and (max-width: 768px) {
    font-size: 0.8em;
    margin: 0 0 12px 0;
    min-height: 34px;
  }
  
  /* Desktop pequeno (769px - 1024px) */
  @media (min-width: 769px) and (max-width: 1024px) {
    font-size: 0.85em;
    margin: 0 0 12px 0;
    min-height: 36px;
    -webkit-line-clamp: 3;
  }
  
  /* Desktop (1025px+) */
  @media (min-width: 1025px) {
    font-size: 0.9em;
    margin: 0 0 14px 0;
    min-height: 40px;
    -webkit-line-clamp: 3;
  }
`;

const ProductPrice = styled.p`
  font-weight: 700;
  color: #2c3e50;
  margin: auto 0 12px 0;
  
  /* Mobile muito pequeno (até 360px) */
  @media (max-width: 360px) {
    font-size: 1em;
    padding-top: 4px;
    margin-bottom: 8px;
  }
  
  /* Mobile (361px - 480px) */
  @media (min-width: 361px) and (max-width: 480px) {
    font-size: 1.1em;
    padding-top: 6px;
    margin-bottom: 10px;
  }
  
  /* Tablet (481px - 768px) */
  @media (min-width: 481px) and (max-width: 768px) {
    font-size: 1.2em;
    padding-top: 8px;
  }
  
  /* Desktop pequeno (769px - 1024px) */
  @media (min-width: 769px) and (max-width: 1024px) {
    font-size: 1.3em;
    padding-top: 8px;
  }
  
  /* Desktop (1025px+) */
  @media (min-width: 1025px) {
    font-size: 1.4em;
    padding-top: 10px;
  }
`;

const ButtonWrapper = styled.div`
  /* Mobile muito pequeno (até 360px) */
  @media (max-width: 360px) {
    padding: 0 8px 8px 8px;
  }
  
  /* Mobile (361px - 480px) */
  @media (min-width: 361px) and (max-width: 480px) {
    padding: 0 10px 10px 10px;
  }
  
  /* Tablet e maiores (481px+) */
  @media (min-width: 481px) {
    padding: 0 12px 12px 12px;
  }
  
  & > button {
    width: 100%;
    margin: 0;
    
    /* Mobile muito pequeno (até 360px) */
    @media (max-width: 360px) {
      padding: 0.5em 0.4em;
      font-size: 0.8em;
    }
    
    /* Mobile (361px - 480px) */
    @media (min-width: 361px) and (max-width: 480px) {
      padding: 0.6em 0.45em;
      font-size: 0.85em;
    }
    
    /* Tablet (481px - 768px) */
    @media (min-width: 481px) and (max-width: 768px) {
      padding: 0.7em 0.5em;
      font-size: 0.9em;
    }
    
    /* Desktop pequeno (769px - 1024px) */
    @media (min-width: 769px) and (max-width: 1024px) {
      padding: 0.75em 0.55em;
      font-size: 0.95em;
    }
    
    /* Desktop (1025px+) */
    @media (min-width: 1025px) {
      padding: 0.8em 0.6em;
      font-size: 1em;
    }
  }
`;

const DEFAULT_IMAGE_URL = 'https://via.placeholder.com/280x200.png?text=Vibe+Açaí';

// --- COMPONENTE LÓGICO (SEM ALTERAÇÕES) ---

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

  const buttonText = isAcai ? "Personalizar" : "Adicionar";

  return (
    <CardWrapper>
      <ProductImage src={imageUrl || DEFAULT_IMAGE_URL} alt={name} />
      <CardContent>
        <ProductName title={name}>{name || 'Nome do Produto'}</ProductName>
        <ProductDescription>{description || 'Descrição não disponível.'}</ProductDescription>
        <ProductPrice>
            {promotionalPrice !== undefined && promotionalPrice !== null 
              ? `R$ ${promotionalPrice.toFixed(2).replace('.', ',')}`
              : `R$ ${price ? price.toFixed(2).replace('.', ',') : '0,00'}`
            }
        </ProductPrice>
      </CardContent>
      <ButtonWrapper>
          <Button onClick={handleActionClick} disabled={!settings.isStoreOpen}>
            {settings.isStoreOpen ? buttonText : "Loja Fechada"}
          </Button>
      </ButtonWrapper>
    </CardWrapper>
  );
};

export default ProductCard;