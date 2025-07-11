import styled, { createGlobalStyle } from 'styled-components';

export const ReceiptWrapper = styled.div`
  /* Estilo para visualização na tela */
  width: 100%;
  max-width: 58mm; /* MUDANÇA AQUI */
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
    box-shadow: none;
    max-width: 100%;
    
    .no-print {
      display: none;
    }
  }
`;

export const PrintStyles = createGlobalStyle`
  @page {
    /* MUDANÇA PRINCIPAL AQUI */
    size: 58mm auto; /* Definindo o tamanho do papel para 58mm */
    margin: 3mm;     /* Reduzindo a margem para caber mais conteúdo */
  }

  @media print {
    html, body {
      width: 58mm;
      background: #fff;
      -webkit-print-color-adjust: exact;
      color-adjust: exact;
    }

    body > #root > *:not(.printable-receipt) {
      display: none;
    }

    body > #root {
      display: block;
    }
  }
`;

// O resto dos estilos com pequenos ajustes de fonte para caber melhor
export const Header = styled.header`
  text-align: center;
  margin-bottom: 10px;

  p {
    font-size: 11px;
    margin: 2px 0;
  }
`;

export const LogoImage = styled.img`
  max-width: 120px;
  max-height: 70px;
  margin-bottom: 8px;
`;

export const Title = styled.h1`
  font-size: 14px;
  font-weight: bold;
  margin: 0 0 2px 0;
  text-transform: uppercase;
`;

export const StoreInfo = styled.p`
  font-size: 11px;
  margin: 2px 0;
`;

export const DottedLine = styled.div`
  border-top: 1px dashed #000;
  margin: 8px 0;
`;

export const Section = styled.section`
  margin-bottom: 8px;
  font-size: 11px;
  
  p {
    margin: 2px 0;
  }
`;

export const SectionTitle = styled.h3`
  font-size: 12px;
  margin: 0 0 8px 0;
  text-align: center;
  font-weight: bold;
`;

export const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 3px;
  font-size: 11px;
  word-break: break-word;

  &.grand-total {
    font-size: 16px;
    font-weight: bold;
    margin-top: 5px;
  }

  &.change {
    font-weight: bold;
  }
`;

export const ItemsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
`;

export const Item = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  font-size: 11px;
`;

export const ItemName = styled.span`
  flex-grow: 1;
  padding-right: 8px;
`;

export const ItemPrice = styled.span`
  white-space: nowrap;
`;

export const Footer = styled.footer`
  padding-top: 8px;
`;

export const ThankYouMessage = styled.p`
  text-align: center;
  font-style: italic;
  margin-top: 15px;
  font-size: 11px;
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