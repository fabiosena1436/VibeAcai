// src/pages/CheckoutPage/styles.js

import styled from 'styled-components';

export const CheckoutPageWrapper = styled.div`
  max-width: 800px;
  margin: 0 auto; // Centraliza e remove a margem de cima
  padding: 30px 15px; // Adiciona padding lateral para telas menores
  background-color: #fff;
  
  @media (min-width: 768px) {
    margin: 40px auto;
    padding: 30px;
    border-radius: 12px;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
  }
`;

export const Title = styled.h1`
  text-align: center;
  color: #7c3aed;
  margin-bottom: 30px;
  margin-top: 0; // Remove a margem que estava antes
`;

export const FormSection = styled.section`
  margin-bottom: 30px;

  h2 {
    font-size: 1.5em;
    color: #333;
    border-bottom: 2px solid #f0f0f0;
    padding-bottom: 10px;
    margin-bottom: 20px;
  }
`;

export const FormGroup = styled.div`
  margin-bottom: 20px;

  label {
    display: block;
    margin-bottom: 8px;
    font-weight: 600;
    color: #555;
  }

  input,
  select,
  textarea {
    width: 100%;
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 1em;
    box-sizing: border-box;
    
    &:focus {
      border-color: #7c3aed;
      outline: none;
      box-shadow: 0 0 0 2px rgba(124, 58, 237, 0.2);
    }
  }
`;

export const PaymentOptionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

export const PaymentOptionLabel = styled.label`
  display: flex;
  align-items: center;
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 6px;
  cursor: pointer;
  transition: border-color 0.2s, box-shadow 0.2s;

  input[type="radio"] {
    margin-right: 12px;
    width: 18px;
    height: 18px;
    accent-color: #7c3aed;
  }

  &:hover {
    border-color: #b690f7;
  }

  &.selected {
    border-color: #7c3aed;
    box-shadow: 0 0 0 2px rgba(124, 58, 237, 0.2);
  }
`;

export const ConditionalInputWrapper = styled.div`
  margin-top: 15px;
  padding: 15px;
  background-color: #f9f9f9;
  border-radius: 6px;
`;

export const PixKeyDisplay = styled.div`
  margin-top: 15px;
  padding: 15px;
  background-color: #e0f7fa;
  border: 1px dashed #007bff;
  border-radius: 6px;

  p {
    margin: 0;
    font-weight: 500;
  }

  strong {
    font-family: monospace;
    word-break: break-all;
  }
`;

export const OrderSummary = styled.div`
  h3 {
    font-size: 1.2em;
    color: #333;
    margin-bottom: 15px;
  }

  ul {
    list-style: none;
    padding: 0;
  }

  li {
    display: flex;
    justify-content: space-between;
    padding: 8px 0;
    border-bottom: 1px dashed #eee;
    font-size: 0.95em;

    &:last-child {
      border-bottom: none;
    }
  }

  strong {
    font-weight: bold;
  }

  .summary-line {
    display: flex;
    justify-content: space-between;
    font-size: 1.1em;
    margin-top: 10px;
    padding-top: 10px;
  }

  .grand-total {
    font-size: 1.4em;
    font-weight: bold;
    color: #7c3aed;
    border-top: 2px solid #7c3aed;
  }
`;

export const LoadingText = styled.p`
  text-align: center;
  color: #555;
  font-style: italic;
  margin-top: 40px;
`;