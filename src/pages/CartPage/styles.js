// src/pages/CartPage/styles.js
import styled from 'styled-components';

export const CartPageWrapper = styled.div`
  padding: 20px;
  max-width: 900px;
  margin: 40px auto;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    margin: 20px 0;
    padding: 15px;
    border-radius: 0;
    box-shadow: none;
    min-height: calc(100vh - 70px);
  }
`;

export const Title = styled.h1`
  text-align: center;
  color: #7c3aed;
  margin-bottom: 30px;
  margin-top: 7%;

  @media (max-width: 768px) {
    font-size: 1.8em;
    margin-bottom: 20px;
  }
`;

export const ItemTopRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
`;

export const CartItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #eee;
  padding: 15px 0;
  gap: 15px;
  &:last-child {
    border-bottom: none;
  }
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
`;

export const ItemDetails = styled.div`
  flex-grow: 1;
  display: flex;
  align-items: center;

  img {
    width: 60px;
    height: 60px;
    object-fit: cover;
    border-radius: 4px;
    margin-right: 15px;
  }

  @media (max-width: 768px) {
    img {
      width: 50px;
      height: 50px;
    }
  }
`;

export const ItemName = styled.h4`
  margin: 0 0 5px 0;
  color: #333;
  max-width: 250px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (max-width: 768px) {
    white-space: normal;
    max-width: 100%;
  }
`;

export const ItemPrice = styled.p`
  margin: 0;
  color: #666;
  font-size: 0.9em;
`;

export const QuantityControl = styled.div`
  display: flex;
  align-items: center;
  min-width: 120px;
  justify-content: center;

  button {
    background-color: #eee;
    border: none;
    color: #333;
    padding: 5px 10px;
    cursor: pointer;
    border-radius: 4px;
    margin: 0 5px;
    font-size: 1em;
    &:hover {
      background-color: #ddd;
    }
  }

  @media (max-width: 768px) {
    justify-content: flex-start;
    min-width: auto;
  }
`;

export const ItemQuantityDisplay = styled.span`
  font-weight: bold;
  margin: 0 10px;
`;

export const ItemSubtotal = styled.span`
  font-weight: bold;
  color: #7c3aed;
  min-width: 100px;
  text-align: right;
  @media (max-width: 768px) {
    text-align: left;
    min-width: auto;
    font-size: 1.1em;
    &::before {
      content: 'Subtotal: ';
      font-weight: normal;
      color: #555;
    }
  }
`;

export const RemoveButton = styled.button`
  font-size: 0.9em;
  margin-left: 15px;
  background-color: #ef4444;
  color: white;
  padding: 6px 12px;
  border: none;
  border-radius: 4px;

  &:hover {
    background-color: #dc2626;
  }

  @media (max-width: 768px) {
    width: auto;
    margin-left: 10px;
    background-color: transparent;
    color: #ef4444;
    padding: 5px;
    font-size: 1.5em;
    font-weight: bold;
    line-height: 1;
    &:hover {
      background-color: #fef2f2;
    }
  }
`;

export const EmptyCartMessage = styled.p`
  text-align: center;
  font-size: 1.2em;
  color: #555;
  padding: 40px 0;
`;

export const TotalsSection = styled.div`
  margin-top: 30px;
  padding-top: 20px;
  border-top: 2px solid #f0f0f0;
  display: flex;
  flex-direction: column;
  align-items: flex-end;

  @media (max-width: 768px) {
    align-items: stretch;
  }
`;

export const SummaryLine = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  max-width: 350px;
  font-size: 1.1em;
  padding: 8px 0;

  span:first-child {
    color: #555;
  }
  span:last-child {
    font-weight: 600;
    color: #333;
  }

  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

export const GrandTotalLine = styled(SummaryLine)`
  font-size: 1.4em;
  font-weight: bold;
  margin-top: 10px;
  padding-top: 10px;
  border-top: 2px solid #7c3aed;

  span:last-child {
    color: #7c3aed;
  }
`;

export const ActionsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-top: 40px;
`;

export const TopButtonsContainer = styled.div`
  display: flex;
  gap: 15px;
  & > * {
    flex: 1;
  }
`;