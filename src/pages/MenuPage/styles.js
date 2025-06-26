import styled from 'styled-components';

// A "PRATELEIRA" - Responsável por centralizar
export const MenuPageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 0;
  background-color: #f8fafc;
  min-height: 100vh;

  @media (min-width: 768px) {
    padding: 40px 0;
  }

  @media (min-width: 1024px) {
    padding: 60px 0;
  }
`;

// --- A "CAIXA" ---
export const MenuHeader = styled.div`
  width: 100%;
  max-width: 1200px;
  padding: 0 20px;
  margin-bottom: 20px;
  box-sizing: border-box;
  text-align: center; /* CENTRALIZA O TÍTULO */

  @media (min-width: 768px) {
    margin-bottom: 30px;
  }

  @media (min-width: 1024px) {
    margin-bottom: 40px;
  }
`;

export const MenuTitle = styled.h1`
  font-size: 2em;
  color: #333;
  text-align: center; /* CENTRALIZA O TEXTO */

  @media (min-width: 768px) {
    font-size: 2.5em;
  }

  @media (min-width: 1024px) {
    font-size: 3em;
  }
`;

export const SearchContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  padding: 0 20px;
  margin-bottom: 20px;
  box-sizing: border-box;
  display: flex;
  justify-content: center; /* CENTRALIZA O CAMPO DE BUSCA */

  @media (min-width: 768px) {
    margin-bottom: 30px;
  }
`;

export const SearchInput = styled.input`
  width: 100%;
  max-width: 600px; /* LIMITA A LARGURA EM TODAS AS TELAS */
  padding: 15px;
  border-radius: 8px;
  border: 1px solid #ddd;
  font-size: 1em;
  box-sizing: border-box;
  transition: border-color 0.2s ease-in-out;

  &:focus {
    outline: none;
    border-color: #7c3aed;
  }

  @media (min-width: 768px) {
    padding: 18px;
    font-size: 1.1em;
  }
`;

export const CategoryCarouselWrapper = styled.div`
  width: 100%;
  max-width: 1200px;
  padding: 0 20px;
  margin-bottom: 20px;
  box-sizing: border-box;
  
  .swiper-slide {
    width: auto;
  }

  /* CENTRALIZA AS CATEGORIAS EM TELAS GRANDES */
  @media (min-width: 768px) {
    margin-bottom: 40px;
    display: flex;
    justify-content: center;
    
    .swiper {
      max-width: 900px;
    }
    
    .swiper-wrapper {
      justify-content: center;
    }
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
  white-space: nowrap;
  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: ${({ $isActive }) => ($isActive ? '#6d28d9' : '#e5e7eb')};
    transform: translateY(-2px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  @media (min-width: 768px) {
    padding: 12px 24px;
    font-size: 1.05em;
  }
`;

export const CategorySectionTitle = styled.h2`
  width: 100%;
  max-width: 1200px;
  padding: 0 20px;
  margin: 25px auto 15px auto; /* CENTRALIZA COM MARGIN AUTO */
  font-size: 1.5em;
  color: #333;
  text-transform: capitalize;
  box-sizing: border-box;
  text-align: center; /* CENTRALIZA O TEXTO */

  @media (min-width: 768px) {
    font-size: 1.8em;
    margin-top: 40px;
    margin-bottom: 25px;
  }

  @media (min-width: 1024px) {
    font-size: 2em;
    margin-top: 50px;
    margin-bottom: 30px;
  }
`;

export const ProductListContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  padding: 0 20px;
  margin: 0 auto; /* CENTRALIZA O CONTAINER */
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 15px;

  @media (min-width: 768px) {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 25px;
    justify-items: center; /* CENTRALIZA OS ITEMS DO GRID */
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 30px;
  }

  @media (min-width: 1440px) {
    grid-template-columns: repeat(4, 1fr);
    gap: 35px;
  }
`;



export const LoadingText = styled.p`
  text-align: center;
  padding: 50px;
  font-size: 1.1em;
  color: #666;
  width: 100%;

  @media (min-width: 768px) {
    padding: 80px;
    font-size: 1.3em;
  }
`;

export const NoProductsText = styled.p`
  text-align: center;
  padding: 40px;
  color: #666;
  font-size: 1.1em;
  width: 100%;
  grid-column: 1 / -1; /* OCUPA TODA A LARGURA DO GRID */

  @media (min-width: 768px) {
    padding: 60px;
    font-size: 1.3em;
  }
`;

export const StoreClosedWarning = styled.div`
  width: 100%;
  max-width: 800px; /* LARGURA MÁXIMA MENOR PARA FICAR MAIS CENTRALIZADO */
  margin: 0 auto 30px auto; /* CENTRALIZA COM MARGIN AUTO */
  padding: 16px;
  background-color: #fffbe6; 
  color: #92400e; 
  border: 1px solid #fde68a;
  border-radius: 8px;
  text-align: center;
  box-sizing: border-box;
  
  h3 { 
    margin-top: 0; 
    font-size: 1.4em; 
    color: #b45309; 
  }
  
  p { 
    margin: 5px 0 0 0; 
    white-space: pre-wrap; 
  }

  @media (min-width: 768px) {
    padding: 24px;
    margin-bottom: 40px;
    
    h3 {
      font-size: 1.6em;
    }
    
    p {
      font-size: 1.1em;
    }
  }

  @media (min-width: 1024px) {
    padding: 32px;
    
    h3 {
      font-size: 1.8em;
    }
  }
`;