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
  height: 100%; // Garante que o card preencha o espaço no grid

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
  font-weight: 700;
  color: #333;
  margin: 0 0 10px 0;
  line-height: 1.2;
`;

export const ProductDescription = styled.p`
  font-size: 0.9em;
  color: #666;
  flex-grow: 1;
  margin: 0 0 15px 0;
  line-height: 1.4;
`;

export const PriceWrapper = styled.div`
  display: flex;
  align-items: baseline;
  gap: 10px;
  margin-bottom: 15px;
`;

export const OriginalPrice = styled.span`
  font-size: 0.9em;
  color: #999;
  text-decoration: line-through;
`;

export const PromotionalPrice = styled.span`
  font-size: 1.4em;
  font-weight: bold;
  color: #5b21b6; // Roxo vibrante
`;