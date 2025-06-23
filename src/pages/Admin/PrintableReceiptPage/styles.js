import styled from 'styled-components';

export const ReceiptWrapper = styled.div`
  width: 100%;
  max-width: 80mm;
  margin: 20px auto;
  padding: 15px;
  font-family: 'Courier New', Courier, monospace;
  color: #000;
  background-color: #fff;
  border: 1px dashed #ccc;

  @media print {
    border: none;
    margin: 0;
    padding: 0;
    max-width: 100%;
    .no-print {
      display: none;
    }
  }
`;

export const Header = styled.header`
  text-align: center;
  margin-bottom: 20px;
  border-bottom: 2px dashed #000;
  padding-bottom: 10px;
`;

export const Title = styled.h1`
  font-size: 18px;
  margin: 0 0 5px 0;
`;

export const InfoSection = styled.section`
  margin-bottom: 20px;
  h3 {
    font-size: 14px;
    margin-bottom: 8px;
    border-bottom: 1px solid #eee;
    padding-bottom: 4px;
  }
`;

export const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
  font-size: 12px;

  &.grand-total {
    font-size: 16px;
    font-weight: bold;
    margin-top: 10px;
    border-top: 2px solid #000;
    padding-top: 5px;
  }
`;

export const ItemsSection = styled.section`
  margin-bottom: 20px;
  h3 {
    font-size: 14px;
    margin-bottom: 8px;
    border-bottom: 1px solid #eee;
    padding-bottom: 4px;
  }
`;

export const ItemTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;

  th, td {
    text-align: left;
    padding: 4px 0;
    vertical-align: top;
  }

  th:last-child, td:last-child {
    text-align: right;
  }
  
  th:first-child, td:first-child {
    width: 40px;
  }

  .toppings-list {
    font-size: 10px;
    font-style: italic;
    color: #333;
    padding-left: 10px;
  }

  /* --- NOVO --- Estilo para o preço unitário */
  .unit-price {
    font-size: 10px;
    font-style: italic;
    color: #555;
  }
`;

export const Footer = styled.footer`
  margin-top: 20px;
  padding-top: 10px;
  border-top: 2px dashed #000;

  hr {
    border: none;
    border-top: 1px dashed #ccc;
    margin: 10px 0;
  }
`;

export const LoadingText = styled.p`
  font-family: Arial, sans-serif;
  text-align: center;
  margin-top: 50px;
`;

export const PrintButton = styled.button`
  display: block;
  width: 100%;
  padding: 10px;
  margin-top: 20px;
  background-color: #7c3aed;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;

  &:hover {
    background-color: #6d28d9;
  }
`;