import styled from 'styled-components';

export const ListItemWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  margin-bottom: 16px;
  overflow: hidden;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  cursor: pointer;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
`;

export const ProductInfo = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

export const ProductName = styled.h3`
  margin: 0 0 4px 0;
  font-size: 1.1em;
  color: #333;
  font-weight: 600;
`;

export const ProductDescription = styled.p`
  margin: 0 0 8px 0;
  font-size: 0.9em;
  color: #666;
  line-height: 1.4;
`;

export const ProductPrice = styled.p`
  margin: 0;
  font-size: 1.15em;
  font-weight: bold;
  color: #16a34a;
  margin-top: auto;
`;


export const ProductImage = styled.img`
  width: 120px;
  height: 120px;
  object-fit: cover;
  flex-shrink: 0;
`;