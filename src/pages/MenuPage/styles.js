import styled from 'styled-components';

export const MenuPageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 0;
  background-color: #f8fafc;
  min-height: 100vh;
`;

export const MenuHeader = styled.div`
  width: 100%;
  max-width: 900px;
  padding: 0 20px;
  margin-bottom: 20px;
`;

export const MenuTitle = styled.h1`
  font-size: 2em;
  color: #333;
  text-align: left;
`;

export const CategoryCarouselWrapper = styled.div`
  width: 100%;
  max-width: 900px;
  padding: 0 20px;
  margin-bottom: 20px;
  box-sizing: border-box;
  .swiper-slide {
    width: auto;
  }
`;

export const CategoryButton = styled.button`
  padding: 10px 20px;
  border-radius: 8px;
  border: none;
  background-color: ${({ $isActive }) => ($isActive ? '#7c3aed' : '#f3f4f6')};
  color: ${({ $isActive }) => ($isActive ? '#fff' : '#374151')};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  white-space: nowrap;

  &:hover {
    background-color: ${({ $isActive }) => ($isActive ? '#6d28d9' : '#e5e7eb')};
  }
`;

export const CategorySectionTitle = styled.h2`
  font-size: 1.5em;
  color: #333;
  padding: 0 20px;
  margin-bottom: 15px;
  margin-top: 25px;
  text-transform: capitalize;
  width: 100%;
  max-width: 900px;
  box-sizing: border-box;
`;

export const ProductListContainer = styled.div`
  width: 100%;
  max-width: 900px;
  padding: 0 20px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
`;

export const LoadingText = styled.p`
  text-align: center;
  padding: 50px;
`;

export const SearchContainer = styled.div`
  width: 100%;
  max-width: 900px;
  padding: 0 20px;
  margin-bottom: 20px;
  box-sizing: border-box;
`;

export const SearchInput = styled.input`
  width: 100%;
  padding: 15px;
  border-radius: 8px;
  border: 1px solid #ddd;
  font-size: 1em;
  box-sizing: border-box;
`;

export const NoProductsText = styled.p`
  text-align: center;
  padding: 40px;
  color: #666;
`;

// --- NOVO --- Estilo para o aviso de loja fechada
export const StoreClosedWarning = styled.div`
  background-color: #fffbe6; color: #92400e; border: 1px solid #fde68a;
  border-radius: 8px; padding: 16px; margin: 0 20px 30px 20px; text-align: center;
  width: 100%;
  max-width: 900px;
  box-sizing: border-box;
  h3 { margin-top: 0; font-size: 1.4em; color: #b45309; }
  p { margin: 5px 0 0 0; white-space: pre-wrap; }
`;