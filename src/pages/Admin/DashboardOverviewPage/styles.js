// src/pages/Admin/DashboardOverviewPage/styles.js

import styled from 'styled-components';

export const PageWrapper = styled.div`
  h1 {
    font-size: 2em;
    color: #333;
    margin-bottom: 30px;
  }
`;

export const SectionTitle = styled.h2`
  font-size: 1.5em; 
  color: #555; 
  margin-top: 0; 
  margin-bottom: 20px; 
  border-bottom: 1px solid #ddd; 
  padding-bottom: 10px; 
  
  &:not(:first-child) { 
    margin-top: 40px; 
  }
`;

export const LoadingText = styled.p`
  text-align: center; 
  color: #555; 
  font-style: italic; 
  margin-top: 20px;
`;

export const ReportsSection = styled.div`
  background-color: #fff; 
  padding: 20px; 
  border-radius: 8px; 
  margin-bottom: 40px; 
  box-shadow: 0 2px 5px rgba(0,0,0,0.07);
  display: grid; 
  grid-template-columns: 1fr 1fr; 
  gap: 20px 40px; 

  h3 { 
    margin-top: 0; 
    color: #555; 
    font-size: 1.2em; 
    margin-bottom: 15px; 
    grid-column: 1 / -1; 
  }

  div { 
    padding-top: 15px; 
    border-top: 1px solid #eee; 
  } 

  p { 
    font-size: 1.1em; 
    color: #333; 
    margin: 10px 0; 
    strong { color: #7c3aed; } 
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 25px;
  }
`;

export const MobileCardList = styled.div`
  display: none;
  padding: 15px;
  background-color: #f9f9f9;

  @media (max-width: 768px) {
    display: block;
  }
`;

export const DesktopDataGrid = styled.div`
  display: block;
  .MuiDataGrid-root {
    border: none;
  }
  @media (max-width: 768px) {
    display: none;
  }
`;

export const OrderCard = styled.div`
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.08);
  padding: 15px;
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
`;

export const CustomerInfo = styled.div`
  h4 {
    margin: 0;
    font-size: 1.15em;
    color: #333;
  }
  span {
    font-size: 0.85em;
    color: #777;
  }
`;

export const OrderTotal = styled.div`
  font-size: 1.2em;
  font-weight: bold;
  color: #7c3aed;
`;

export const StatusSelector = styled.select`
  width: 100%;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
  background-color: #fff;
  cursor: pointer;
  font-size: 1em;
  margin-top: 5px;

  &:focus {
    outline: none;
    border-color: #7c3aed;
  }
`;