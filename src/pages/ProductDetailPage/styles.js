import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const PageWrapper = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding-bottom: 120px;
  position: relative;
`;

export const BackButton = styled(Link)`
  position: absolute;
  top: 15px;
  left: 15px;
  z-index: 10;
  background-color: rgba(0, 0, 0, 0.4);
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;

  &:hover {
    background-color: rgba(0, 0, 0, 0.6);
  }

  svg {
    width: 24px;
    height: 24px;
  }
`;

export const LoadingText = styled.p`
  text-align: center;
  padding: 50px;
  font-size: 1.2em;
`;

export const ProductBanner = styled.img`
  width: 100%;
  height: 300px;
  object-fit: cover;
`;

export const ProductContent = styled.div`
  padding: 20px;
  background-color: #fff;
`;

export const ProductName = styled.h1`
  font-size: 2.5em;
  color: #333;
  margin: 0 0 10px 0;
`;

export const ProductDescription = styled.p`
  font-size: 1.1em;
  color: #666;
  line-height: 1.6;
  margin-bottom: 30px;
`;

export const CustomizationSection = styled.div`
  margin-bottom: 30px;
`;

export const SectionTitle = styled.h2`
  font-size: 1.5em;
  color: #444;
  border-bottom: 2px solid #f0f0f0;
  padding-bottom: 10px;
  margin-bottom: 20px;
`;

export const OptionGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 30px;
`;

export const OptionLabel = styled.label`
  display: block;
  padding: 12px 20px;
  border: 2px solid ${({ $isActive }) => ($isActive ? '#7c3aed' : '#ddd')};
  background-color: ${({ $isActive }) => ($isActive ? '#f3e8ff' : '#fff')};
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  input[type="radio"] {
    display: none;
  }
`;

export const ToppingGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 15px;
`;

/**
 * ## MUDANÇA PRINCIPAL (Estilos) ##
 * - Adicionamos um `ToppingImage` para a foto do adicional.
 * - Ajustamos o `ToppingItemLabel` e `ToppingInfo` para alinhar
 * corretamente a imagem, o nome e o preço.
 */
export const ToppingImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 6px;
  object-fit: cover;
  margin-right: 12px;
  flex-shrink: 0;
`;

export const ToppingItemLabel = styled.label`
  display: flex;
  align-items: center;
  padding: 10px;
  border: 1px solid #eee;
  border-radius: 8px;
  cursor: pointer;
  background-color: #fafafa;
  transition: background-color 0.2s, border-color 0.2s;

  &:has(input:checked) {
    background-color: #f3e8ff;
    border-color: #7c3aed;
  }
  
  input[type="checkbox"] {
    display: none;
  }

  .custom-checkbox {
    width: 20px;
    height: 20px;
    border: 2px solid #ccc;
    border-radius: 4px;
    margin-right: 15px;
    transition: all 0.2s;
    flex-shrink: 0;
  }

  input:checked + .custom-checkbox {
    background-color: #7c3aed;
    border-color: #7c3aed;
    background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3e%3c/svg%3e");
    background-position: center;
    background-repeat: no-repeat;
  }
`;

export const ToppingInfo = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;

  span {
    color: #333;
    font-weight: 500;
  }
  strong {
    color: #888;
    font-size: 0.9em;
    font-weight: 600;
  }
`;

export const ActionBar = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background-color: #fff;
  box-shadow: 0 -4px 12px rgba(0,0,0,0.1);
  max-width: 800px;
  margin: 0 auto;
`;

export const QuantityControl = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  
  button {
    width: 40px;
    height: 40px;
    border: 1px solid #ddd;
    background-color: #f7f7f7;
    border-radius: 50%;
    font-size: 1.5em;
    cursor: pointer;
  }
  span {
    font-size: 1.2em;
    font-weight: bold;
  }
`;

export const TotalPrice = styled.strong`
  margin-left: 10px;
`;

export const ToppingCategory = styled.h3`
  font-size: 1.2em;
  color: #5b21b6;
  margin-top: 30px;
  margin-bottom: 15px;
  padding-bottom: 5px;
  border-bottom: 1px solid #eee;
  text-transform: capitalize;
`;

export const CategoryFilterContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 25px;
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
  
  background-color: ${({ $isActive }) => ($isActive ? '#7c3aed' : '#f3f4f6')};
  color: ${({ $isActive }) => ($isActive ? '#fff' : '#374151')};
  border: 2px solid ${({ $isActive }) => ($isActive ? '#7c3aed' : 'transparent')};

  &:hover {
    background-color: ${({ $isActive }) => ($isActive ? '#7c3aed' : '#e5e7eb')};
    border-color: #7c3aed;
  }
`;

export const SuggestedProductsSection = styled.div`
  margin-top: 40px;
`;

export const SuggestedProductLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 10px;
  margin-bottom: 10px;
  background-color: #f9f9f9;
  border-radius: 8px;
  cursor: pointer;
  border: 1px solid #f9f9f9;
  transition: background-color 0.2s, border-color 0.2s;

  &:has(input:checked) {
    background-color: #f3e8ff;
    border-color: #c4b5fd;
  }

  input[type="checkbox"] {
    display: none;
  }

  .custom-checkbox {
    width: 20px;
    height: 20px;
    border: 2px solid #ccc;
    border-radius: 4px;
    transition: all 0.2s;
    flex-shrink: 0;
  }

  input:checked + .custom-checkbox {
    background-color: #7c3aed;
    border-color: #7c3aed;
    background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3e%3c/svg%3e");
    background-position: center;
    background-repeat: no-repeat;
  }

  img {
    width: 50px;
    height: 50px;
    object-fit: cover;
    border-radius: 6px;
  }

  .info {
    display: flex;
    flex-direction: column;
    
    span {
      font-weight: 500;
      color: #333;
    }
    
    strong {
      font-size: 0.9em;
      color: #555;
    }
  }
`;