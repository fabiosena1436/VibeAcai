// src/components/ProductCard/styles.js
import styled from 'styled-components';

const CardWrapper = styled.div`
  background-color: #fff;
  border: 1px solid #eee;
  border-radius: 12px;
  padding: 16px;
  width: 100%; /* ALTERADO de width: 280px para 100% */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }
`;

export const ProductImage = styled.img`
  width: 100%;
  max-height: 200px;
  object-fit: cover; /* Para a imagem cobrir a área sem distorcer */
  border-radius: 8px;
  margin-bottom: 12px;
`;

export const ProductName = styled.h3`
  font-size: 1.4em;
  color: #333;
  margin-bottom: 8px;
  font-weight: 600;
`;

export const ProductDescription = styled.p`
  font-size: 0.9em;
  color: #666;
  margin-bottom: 12px;
  line-height: 1.4;
  min-height: 50px; /* Para manter uma altura mínima mesmo com descrições curtas */
`;

export const ProductPrice = styled.p`
  font-size: 1.3em;
  color: #7c3aed; /* Cor roxa do nosso tema */
  font-weight: bold;
  margin-bottom: 16px;
`;