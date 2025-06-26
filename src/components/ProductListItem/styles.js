import styled from 'styled-components';

export const ListItemWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  margin-bottom: 16px;
  overflow: hidden;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  cursor: pointer;
  height: 100%;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }

  /* AJUSTES PARA TELAS GRANDES */
  @media (min-width: 768px) {
    flex-direction: column;
    height: auto;
    min-height: 320px;
  }

  @media (min-width: 1024px) {
    min-height: 360px;
  }
`;

export const ProductInfo = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  
  /* EM TELAS GRANDES, ORDEM DIFERENTE */
  @media (min-width: 768px) {
    order: 2;
    padding: 20px;
  }
`;

export const ProductName = styled.h3`
  margin: 0 0 4px 0;
  font-size: 1.1em;
  color: #333;
  font-weight: 600;

  @media (min-width: 768px) {
    font-size: 1.3em;
    margin-bottom: 8px;
  }

  @media (min-width: 1024px) {
    font-size: 1.4em;
  }
`;

export const ProductDescription = styled.p`
  margin: 0 0 8px 0;
  font-size: 0.9em;
  color: #666;
  line-height: 1.4;
  
  /* LIMITA NÚMERO DE LINHAS */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;

  @media (min-width: 768px) {
    font-size: 1em;
    margin-bottom: 12px;
    -webkit-line-clamp: 3;
    line-height: 1.5;
  }

  @media (min-width: 1024px) {
    font-size: 1.05em;
  }
`;

export const ProductPrice = styled.p`
  margin: 0;
  font-size: 1.15em;
  font-weight: bold;
  color: #16a34a;
  margin-top: auto;

  @media (min-width: 768px) {
    font-size: 1.3em;
    margin-top: auto;
    padding-top: 8px;
  }

  @media (min-width: 1024px) {
    font-size: 1.4em;
  }
`;

export const ProductImage = styled.img`
  width: 120px;
  height: 120px;
  object-fit: cover;
  flex-shrink: 0;

  /* EM TELAS GRANDES, IMAGEM FICA EM CIMA */
  @media (min-width: 768px) {
    order: 1;
    width: 100%;
    height: 200px;
  }

  @media (min-width: 1024px) {
    height: 240px;
  }
`;