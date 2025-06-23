import React from 'react';
import { Link } from 'react-router-dom';
import { ListItemWrapper, ProductImage, ProductInfo, ProductName, ProductDescription, ProductPrice } from './styles';

const ProductListItem = ({ product }) => {
  if (!product || !product.id) {
    return null; 
  }

  const descriptionSnippet = product.description ? `${product.description.substring(0, 100)}...` : 'Clique para ver os detalhes e montar seu açaí!';

  return (
    <Link to={`/produto/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <ListItemWrapper>
        <ProductInfo>
          <ProductName>{product.name}</ProductName>
          <ProductDescription>
            {/* --- ALTERADO: Mostra uma descrição padrão se não houver uma */}
            {product.category?.toLowerCase() === 'açaí' && !product.description 
              ? 'Clique para montar do seu jeito!' 
              : product.description || ''}
          </ProductDescription>
          
          {/* --- ALTERADO: Lógica para esconder o preço do açaí --- */}
          {product.category?.toLowerCase() !== 'açaí' && (
            <ProductPrice>R$ {product.price.toFixed(2).replace('.', ',')}</ProductPrice>
          )}

        </ProductInfo>
        <ProductImage src={product.imageUrl || 'https://via.placeholder.com/150'} alt={product.name} />
      </ListItemWrapper>
    </Link>
  );
};

export default ProductListItem;