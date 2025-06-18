// src/pages/Admin/DashboardOverviewPage/styles.js
import styled from 'styled-components';

export const DashboardWrapper = styled.div`
  /* O padding foi removido para evitar espaçamento duplicado, 
     já que ContentArea do AdminLayout já possui padding. 
     Ajuste se necessário. */
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`;

export const Title = styled.h1`
  font-size: 2rem;
  color: #333;
  margin: 0;
`;

export const OrdersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 25px;
`;

export const OrderCard = styled.div`
  background-color: white;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  padding: 20px;
  display: flex;
  flex-direction: column;
  transition: box-shadow 0.2s;

  &:hover {
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  }
`;

export const OrderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 10px;

  h3 {
    margin: 0;
    font-size: 1.1rem;
    color: #4a044e;
    word-break: break-word;
  }
`;

export const StatusBadge = styled.span`
  padding: 5px 12px;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: white;
  flex-shrink: 0;
  margin-left: 10px;
  background-color: ${({ status }) => {
    switch (status) {
      case 'Pendente': return '#f59e0b'; // Amarelo
      case 'Em Preparo': return '#3b82f6'; // Azul
      case 'Pronto para Retirada': return '#10b981'; // Verde
      case 'Finalizado': return '#6b7280'; // Cinza
      default: return '#ccc';
    }
  }};
`;

export const OrderBody = styled.div`
  flex-grow: 1;
  
  ul {
    list-style: none;
    padding: 0;
    margin: 0 0 15px 0;
    
    li {
      margin-bottom: 8px;
      font-size: 0.9rem;
      color: #555;
      line-height: 1.4;
    }
  }

  p {
    margin: 8px 0;
    font-size: 0.9rem;
  }

  strong {
    color: #333;
    font-weight: 600;
  }
`;

export const OrderActions = styled.div`
  margin-top: auto;
  padding-top: 15px;
  border-top: 1px solid #f0f0f0;
  
  label {
    display: block;
    margin-bottom: 5px;
    font-size: 0.85rem;
    font-weight: 600;
    color: #555;
  }

  select {
    width: 100%;
    padding: 10px;
    border-radius: 6px;
    border: 1px solid #ccc;
    background-color: #fff;
    font-size: 0.95rem;
    cursor: pointer;

    &:focus {
      outline: none;
      border-color: #7c3aed;
      box-shadow: 0 0 0 2px rgba(124, 58, 237, 0.2);
    }
  }
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 50px 20px;
  background-color: #fff;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  width: 100%;

  p {
    font-size: 1.2rem;
    color: #6b7280;
    margin: 0;
  }
`;