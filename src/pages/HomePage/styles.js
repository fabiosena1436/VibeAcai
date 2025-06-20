// src/pages/HomePage/styles.js

import styled from 'styled-components';

export const HomePageWrapper = styled.div`
  padding-bottom: 50px;
`;

export const HeroSection = styled.div`
  width: 100%;
  height: 45vh;
  min-height: 350px;
  max-height: 450px;
  background-image: ${props => props.bgImage ? `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(${props.bgImage})` : 'linear-gradient(45deg, #7c3aed, #5b21b6)'};
  background-size: cover;
  background-position: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;

  @media (max-width: 768px) {
    min-height: 300px;
    height: 40vh;
  }
`;

export const HeroContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 90%;
`;

export const LogoOverlay = styled.div`
  background-color: rgb(247 241 241 / 76%);
  border-radius: 50%;
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 0 20px rgba(0,0,0,0.5);
  margin-bottom: 20px;
  
  img {
    height: 120px;
    width: 120px;
    object-fit: contain;
  }
  
  @media (max-width: 768px) {
    padding: 15px;
    img {
      height: 100px;
      width: 100px;
    }
  }
`;

export const StatusInfo = styled.div`
  background-color: ${props => props.isOpen ? '#16a34a' : '#ef4444'};
  color: white;
  padding: 8px 20px;
  border-radius: 20px;
  font-weight: bold;
  box-shadow: 0 4px 10px rgba(0,0,0,0.2);
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const HeroMenuButton = styled.div`
  background-color: #5b21b6;
  color: white;
  padding: 8px 20px;
  border-radius: 20px;
  font-weight: bold;
  box-shadow: 0 4px 10px rgba(0,0,0,0.2);
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 15px;
  cursor: pointer;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

export const Section = styled.section`
  max-width: 1200px;
  margin: 50px auto;
  padding: 0 20px;
  
  @media (max-width: 768px) {
    padding: 0 15px;
  }
`;

export const SectionTitle = styled.h2`
  font-size: 2.2em;
  color: #5b21b6;
  text-align: center;
  margin-bottom: 30px;
  
  @media (max-width: 768px) {
    font-size: 1.8em;
  }
`;

export const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  justify-items: center;
  align-items: stretch;

  @media (min-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 30px;
  }
`;

export const LoadingText = styled.p`
  text-align: center;
  color: #555;
  font-style: italic;
  margin-top: 40px;
  font-size: 1.2em;
`;

export const Title = styled.h1`
  font-size: 3em;
  color: #7c3aed;
  margin-bottom: 20px;
  
  @media (max-width: 768px) {
    font-size: 2.2em;
  }
`;

export const StoreClosedWarning = styled.div`
  background-color: #fffbe6;
  color: #92400e;
  border: 1px solid #fde68a;
  border-radius: 8px;
  padding: 16px;
  margin: -20px auto 40px auto;
  max-width: 1160px;
  text-align: center;
  box-shadow: 0 4px 10px rgba(0,0,0,0.05);

  h3 {
    margin-top: 0;
    font-size: 1.4em;
    color: #b45309;
  }

  p {
    margin: 5px 0 0 0;
    white-space: pre-wrap;
  }
`;

export const CarouselWrapper = styled.div`
  position: relative;
  padding: 0 10px;

  .swiper {
    padding-bottom: 40px;
  }

  .swiper-button-next,
  .swiper-button-prev {
    color: #5b21b6;
    transition: transform 0.2s ease;
    
    &:hover {
      transform: scale(1.1);
    }

    @media (max-width: 768px) {
      display: none;
    }
  }

  .swiper-pagination {
    position: absolute;
    bottom: 8px; 
    left: 0;
    width: 100%;
  }

  .swiper-pagination-bullet {
    background: #a78bfa;
    width: 10px;
    height: 10px;
    opacity: 0.7;
  }

  .swiper-pagination-bullet-active {
    background: #5b21b6;
    opacity: 1;
  }
  
  @media (max-width: 768px) {
    padding: 0 5px;
  }
`;