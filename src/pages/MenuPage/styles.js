import styled from 'styled-components';

export const MenuPageWrapper = styled.div`
 padding: 100px 0 40px 0; /* Aumentei o padding inferior para 40px */
 background-color: #f4f0ff;
 min-height: 100vh;
 display: flex;
 flex-direction: column;
 align-items: center;
`;

export const MenuHeader = styled.div`
 text-align: center;
 margin-bottom: 30px;
`;

export const MenuTitle = styled.h1`
 color: #7c3aed;
 font-size: 2.5em;
 margin-bottom: 10px;
`;

export const CategoryCarouselWrapper = styled.div`
 width: 100%;
 margin-bottom: 50px; /* ▼ AUMENTADO de 40px para 50px */
 position: sticky;
 top: 70px;
 background-color: #f4f0ff;
 padding: 15px 0;
 z-index: 100;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05); /* Adicionado um sombreamento suave */

 .swiper-wrapper {
  justify-content: center; 
  padding: 0 20px;
 }

 .swiper-slide {
  width: auto;
 }
`;

export const CategoryButton = styled.button`
 padding: 10px 25px;
 border-radius: 50px;
 border: 1px solid #8e44ad;
 cursor: pointer;
 font-weight: bold;
 background-color: ${({ active }) => (active ? '#8e44ad' : '#fff')};
 color: ${({ active }) => (active ? '#fff' : '#8e44ad')};
 transition: all 0.3s ease;
 white-space: nowrap;

 &:hover {
  background-color: #9b59b6;
  color: #fff;
 }
`;

export const CategorySectionTitle = styled.h2`
 font-size: 2em;
 color: #5b21b6;
 text-align: center;
 margin-top: 60px; /* ▼ AUMENTADO de 40px para 60px */
 margin-bottom: 30px; /* ▼ AUMENTADO de 20px para 30px */
 width: 100%;
`;

export const ProductListContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 27px; /* ▼ AUMENTADO de 24px para 32px */
  width: 100%;
  max-width: 1200px;
  padding: 0 16px;
  margin: 0 auto;
  justify-items: center;
  align-items: stretch;

  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 960px) {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  }
`;

// ... (o resto do seu ficheiro permanece igual)
export const LoadingText = styled.p`
 text-align: center;
 font-size: 1.2em;
 color: #555;
 margin-top: 50px;
`;

export const SearchContainer = styled.div`
 padding: 0 20px;
 margin-bottom: 30px;
 text-align: center;
 width: 100%;
`;

export const SearchInput = styled.input`
 padding: 12px;
 font-size: 1em;
 width: 100%;
 max-width: 500px;
 border-radius: 20px;
 border: 1px solid #ddd;

 &:focus {
  border-color: #7c3aed;
  outline: none;
 }
`;

export const NoProductsText = styled.p`
 text-align: center;
 color: #555;
 margin-top: 20px;
 width: 100%;
`;