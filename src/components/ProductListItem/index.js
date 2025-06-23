import React from 'react';
import { Link } from 'react-router-dom';
import { ListItemWrapper, ProductImage, ProductInfo, ProductName, ProductDescription, ProductPrice } from './styles';

const ProductListItem = ({ product }) => {
  // --- ALTERADO --- Adicionamos uma verificação de segurança.
  // Se o produto for inválido, o componente não renderiza nada e evita o erro.
  if (!product || !product.id) {
    return null; 
  }

  const descriptionSnippet = product.description ? `${product.description.substring(0, 100)}...` : '';

  return (
    <Link to={`/produto/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <ListItemWrapper>
        <ProductInfo>
          <ProductName>{product.name}</ProductName>
          <ProductDescription>{descriptionSnippet}</ProductDescription>
          <ProductPrice>R$ {product.price.toFixed(2).replace('.', ',')}</ProductPrice>
        </ProductInfo>
        <ProductImage src={product.imageUrl || 'https://via.placeholder.com/150'} alt={product.name} />
      </ListItemWrapper>
    </Link>
  );
};

export default ProductListItem;