import styled from 'styled-components';

export const ReceiptWrapper = styled.div`
  width: 100%;
  max-width: 80mm; /* Largura padrão de impressora térmica */
  margin: 20px auto;
  padding: 15px;
  font-family: 'Courier New', Courier, monospace;
  color: #000;
  background-color: #fff;
  border: 1px dashed #ccc;
  box-sizing: border-box;

  @media print {
    border: none;
    margin: 0;
    padding: 0;
    width: 100%;
    max-width: 100%;
    .no-print {
      display: none;
    }
  }
`;

export const Header = styled.header`
  text-align: center;
  margin-bottom: 15px;

  p {
    font-size: 12px;
    margin: 2px 0;
  }
`;

export const LogoImage = styled.img`
  max-width: 150px;
  max-height: 80px;
  margin-bottom: 10px;
`;

export const Title = styled.h1`
  font-size: 15px;
  font-weight: bold;
  margin: 0 0 2px 0;
  text-transform: uppercase;
`;

export const StoreAddress = styled.p`
  font-size: 12px;
  margin: 0 0 10px 0;
`;

export const InfoSection = styled.section`
  margin-bottom: 5px;
  border-top: 1px dashed #000;
  border-bottom: 1px dashed #000;
  padding: 10px 0;

  h3 {
    font-size: 14px;
    margin: 0 0 5px 0;
    text-align: center;
    font-weight: bold;
  }
`;

export const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 3px;
  font-size: 12px;

  &.grand-total {
    font-size: 18px;
    font-weight: bold;
    margin-top: 2px;
    padding-top: 2px;
  }
`;

export const ItemsSection = styled.section`
  margin-bottom: 15px;
  h3 {
    font-size: 14px;
    margin: 0 0 8px 0;
    text-align: center;
    font-weight: bold;
  }
`;

// Removemos ItemTable e criamos novos estilos para a lista de itens
export const ItemsList = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Item = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  font-size: 11px;
  margin-bottom: 5px;
`;

export const ItemName = styled.div`
  flex-grow: 1;
  padding-right: 10px; /* Espaço para não colar no preço */
`;

export const ItemPrice = styled.span`
  white-space: nowrap;
`;

export const UnitPrice = styled.div`
  font-size: 10px;
  color: #555;
  padding-left: 10px;
`;

export const ToppingsList = styled.div`
  font-size: 10px;
  font-style: italic;
  color: #333;
  padding-left: 10px;
`;

export const Footer = styled.footer`
  padding-top: 5px;
  border-top: 1px dashed #000;
`;

export const DottedLine = styled.div`
  border-top: 1px dashed #000;
  margin: 5px 0;
`;

export const ThankYouMessage = styled.p`
  text-align: center;
  font-style: italic;
  margin-top: 10px;
  font-size: 12px;
`;

export const LoadingText = styled.p`
  font-family: Arial, sans-serif;
  text-align: center;
  margin-top: 20px;
`;

export const PrintButton = styled.button`
  display: block;
  width: 100%;
  padding: 10px;
  margin-top: 10px;
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