import styled from 'styled-components';

export const PromoCardContainer = styled.div`
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 1rem;
  margin: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  width: 280px;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-5px);
  }
`;

export const PromoImage = styled.img`
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 5px;
  margin-bottom: 1rem;
`;

export const PromoTitle = styled.h3`
  font-size: 1.25rem;
  color: #333;
  margin: 0.5rem 0;
`;

export const PromoDescription = styled.p`
  font-size: 0.9rem;
  color: #666;
  flex-grow: 1;
`;

export const PromoPrice = styled.div`
  font-size: 1.1rem;
  color: #e74c3c;
  margin-top: 1rem;

  span {
    text-decoration: line-through;
    color: #999;
    margin-right: 0.5rem;
  }
`;