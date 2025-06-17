// src/components/AcaiCustomizationModal/styles.js
import styled from 'styled-components';

export const SizeOptionsContainer = styled.div`
  margin-bottom: 20px;
  h4 { margin-bottom: 10px; color: #555; }
`;

export const SizeButton = styled.button`
  background-color: ${props => props.selected ? '#7c3aed' : '#eee'};
  color: ${props => props.selected ? '#fff' : '#333'};
  border: 1px solid ${props => props.selected ? '#7c3aed' : '#ddd'};
  padding: 10px 15px;
  margin-right: 10px;
  margin-bottom: 10px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9em;
  font-weight: 500;
  transition: background-color 0.2s, color 0.2s;
  &:hover {
    background-color: ${props => props.selected ? '#6d28d9' : '#ddd'};
  }
`;

export const PriceInfo = styled.div`
  margin-top: 20px;
  font-size: 1.2em;
  text-align: right;
  color: #333;
  font-weight: 500;
  strong { color: #7c3aed; font-weight: bold; }
`;

export const ToppingOptionsContainer = styled.div`
  margin-bottom: 20px;
  h4 { margin-bottom: 10px; color: #555; }
  .promo-title { font-size: 1em; color: #7c3aed; font-weight: bold; }
`;

export const ToppingLabel = styled.label`
  display: flex;
  align-items: center;
  margin-bottom: 12px; // Aumentamos um pouco o espaço
  cursor: pointer;
  font-size: 0.95em;
  justify-content: space-between;

  &.disabled {
    cursor: not-allowed;
    color: #aaa;
  }
`;

// NOVO: Div para agrupar imagem, checkbox e nome
export const ToppingInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

// NOVO: Estilo para a imagem do adicional
export const ToppingImage = styled.img`
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 6px;
`;

export const ToppingName = styled.span`
  margin-left: 5px;
`;

export const ToppingPriceText = styled.span`
  color: #555;
  font-weight: 500;
  &.free {
    color: #16a34a;
    font-weight: bold;
  }
`;

export const CheckboxInput = styled.input.attrs({ type: 'checkbox' })`
  width: 18px;
  height: 18px;
  accent-color: #7c3aed;
`;