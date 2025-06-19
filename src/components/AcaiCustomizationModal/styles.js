import styled from 'styled-components';

export const SectionTitle = styled.h2`
  font-size: 1.4em;
  color: #4a4a4a;
  margin: 25px 0 15px 0;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;

  &:first-of-type {
    margin-top: 0;
  }
`;

export const OptionsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
`;

export const OptionItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  border: 2px solid ${({ $isSelected }) => ($isSelected ? '#7c3aed' : '#ddd')};
  background-color: ${({ $isSelected }) => ($isSelected ? '#f3e8ff' : '#fff')};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  font-weight: 500;
  color: ${({ $isSelected }) => ($isSelected ? '#5b21b6' : '#333')};

  ${({ $isTopping }) =>
    $isTopping &&
    `
    cursor: pointer; 
  `}

  &:hover {
    border-color: #7c3aed;
  }

  span {
    flex-grow: 1;
  }
`;

export const ToppingCategory = styled.h3`
  font-size: 1.1em;
  color: #666;
  margin: 20px 0 10px 0;
  text-transform: capitalize;
`;

export const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  font-size: 1.2em;
  color: #666;
  font-style: italic;
`;

export const ToppingInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const ToppingImage = styled.img`
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 6px;
  flex-shrink: 0;
`;

export const CheckboxWrapper = styled.div`
  position: relative;
  width: 22px;
  height: 22px;
  flex-shrink: 0;
  margin-left: 15px;

  input[type="checkbox"] {
    opacity: 0; width: 100%; height: 100%; position: absolute; cursor: pointer;
  }

  &::before {
    content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 100%;
    border-radius: 4px; transition: all 0.2s;
    background-color: ${({ $isSelected }) => ($isSelected ? '#7c3aed' : '#fff')};
    border: 2px solid ${({ $isSelected }) => ($isSelected ? '#7c3aed' : '#aaa')};
  }

  &::after {
    content: '✔'; position: absolute; top: -2px; left: 4px; font-size: 18px; color: #fff;
    transition: opacity 0.2s;
    opacity: ${({ $isSelected }) => ($isSelected ? '1' : '0')};
  }
`;

// --- [NOVO] Estilos para o container e botões de filtro de categoria ---

export const CategoryFilterContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #f0f0f0;
`;

export const CategoryFilterButton = styled.button`
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.9em;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  
  /* Estilo condicional baseado na propriedade $isActive */
  background-color: ${({ $isActive }) => ($isActive ? '#7c3aed' : '#f3f4f6')};
  color: ${({ $isActive }) => ($isActive ? '#fff' : '#374151')};
  border: 2px solid ${({ $isActive }) => ($isActive ? '#7c3aed' : 'transparent')};

  &:hover {
    background-color: ${({ $isActive }) => ($isActive ? '#7c3aed' : '#e5e7eb')};
    border-color: #7c3aed;
  }
`;