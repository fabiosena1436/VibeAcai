import styled from 'styled-components';
import Button from '../Button';

export const CardWrapper = styled.div`
  background: linear-gradient(135deg, #f3e8ff, #e9d5ff);
  border: 2px solid #a855f7;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(124, 58, 237, 0.2);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`;

export const CardImage = styled.img`
  width: 100%;
  height: 180px;
  object-fit: cover;
`;

export const CardContent = styled.div`
  padding: 4px;
  display: flex;
  flex-direction: column;
  text-align: center;
  flex-grow: 1;
`;

export const PromoTitle = styled.h3`
  font-size: 1.3em;
  font-weight: 700;
  color: #5b21b6;
  margin: 0 0 10px 0;
`;

export const PromoDescription = styled.p`
  font-size: 0.95em;
  color: #4a044e;
  line-height: 1.5;
  margin: 0 0 15px 0;
  flex-grow: 1;
  strong {
    font-weight: 700;
  }
`;

export const PriceInfo = styled.div`
  margin-bottom: 20px;
  font-size: 1.1em;
  color: #333;
  span {
    font-size: 1.8em;
    font-weight: bold;
    color: #7e22ce;
    display: block;
  }
`;

export const ButtonStyled = styled(Button)`
  width: 100%;
  margin-top: auto;
  background-color: #7e22ce;

  &:hover {
    background-color: #5b21b6;
  }
`;