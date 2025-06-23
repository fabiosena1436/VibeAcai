import styled from 'styled-components';

export const CardWrapper = styled.div`
  background-color: #fff;
  border-radius: 7px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.08);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: transform 0.3s, box-shadow 0.3s;
  cursor: pointer;
  width: 100%;
  height: 100%;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0,0,0,0.12);
  }
`;

export const CardImage = styled.img`
  width: 100%;
  height: 180px;
  object-fit: cover;
`;

export const CardContent = styled.div`
  padding: 15px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

export const ProductName = styled.h3`
  font-size: 1.2em;
  color: #333;
  margin: 0 0 8px 0;
`;

// --- ALTERADO --- Adiciona `line-clamp` para limitar o texto da descrição
export const ProductDescription = styled.p`
  font-size: 0.9em;
  color: #666;
  flex-grow: 1;
  margin: 0 0 15px 0;
  line-height: 1.4;
  
  /* Limita o texto a 3 linhas e adiciona "..." */
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;  
  overflow: hidden;
`;

export const PriceWrapper = styled.div`
  display: flex;
  align-items: baseline;
  gap: 10px;
  margin-bottom: 15px;
`;

export const OriginalPrice = styled.span`
  font-size: 0.9em;
  color: #9ca3af;
  text-decoration: line-through;
`;

export const PromotionalPrice = styled.span`
  font-size: 1.3em;
  font-weight: bold;
  color: #7c3aed;
`;