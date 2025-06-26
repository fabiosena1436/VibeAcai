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
  
  &:not(:first-child){
    margin-top: 40px;
  }
`;

export const AddForm = styled.form`
  background-color: #f9f9f9; 
  padding: 20px; 
  border-radius: 8px; 
  margin-top: 10px; 
  margin-bottom: 40px; 
  display: grid; 
  gap: 15px 20px; 
  border: 1px solid #eee;
  grid-template-columns: 1fr;

  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
`;

export const FormGroup = styled.div`
  display: flex; 
  flex-direction: column; 
  
  label { 
    margin-bottom: 5px; 
    font-weight: 600; 
    color: #444; 
  } 
  
  input, 
  select, 
  textarea { 
    padding: 10px; 
    border: 1px solid #ccc; 
    border-radius: 6px; 
    font-size: 1em; 
    background-color: white; 
    width: 100%;
  }
  
  &.full-width {
    grid-column: 1 / -1;
  }
`;

export const FormActions = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  grid-column: 1 / -1;
  margin-top: 10px;
`;

export const LoadingText = styled.p`
  text-align: center; 
  color: #555; 
  font-style: italic; 
  margin-top: 20px;
`;

export const PromotionList = styled.ul`
  list-style: none; 
  padding: 0;
`;


export const ProductImage = styled.img`
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
  border: 2px solid #f0f0f0;
  flex-shrink: 0;
`;

export const PromoContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex-grow: 1;
`;


export const PromotionListItem = styled.li`
  background-color: #fff; 
  padding: 15px; 
  border-radius: 8px; 
  margin-bottom: 15px; 
  box-shadow: 0 2px 5px rgba(0,0,0,0.07);
  display: flex; 
  align-items: center; 
  gap: 20px;

  .promo-info { 
    flex-grow: 1; 
  }
  
  .promo-header { 
    display: flex; 
    justify-content: space-between; 
    align-items: flex-start; 
    margin-bottom: 8px; 
    gap: 15px; 
  }
  
  .promo-title { 
    font-size: 1.2em; 
    font-weight: bold; 
    color: #7c3aed; 
    margin: 0; 
  }
  
  .promo-status { 
    font-size: 0.8em; 
    padding: 3px 6px; 
    border-radius: 4px; 
    font-weight: bold; 
    flex-shrink: 0;
    
    &.active { 
      background-color: #dcfce7; 
      color: #166534; 
    }
    
    &.inactive { 
      background-color: #fee2e2; 
      color: #991b1b; 
    }
  }
  
  .promo-description { 
    font-size: 0.95em; 
    color: #333; 
    margin: 0 0 10px 0; 
    word-break: break-word; 
    
    strong { 
      color: #5b21b6; 
    }
  }
  
  .promo-actions { 
    display: flex; 
    gap: 10px; 
    flex-shrink: 0;
    
    button { 
      font-size: 0.9em; 
      padding: 6px 12px; 
    }
  }
  
  @media (max-width: 768px) {
    align-items: flex-start;
    
    ${ProductImage} {
      width: 60px;
      height: 60px;
    }
    
    .promo-actions {
      flex-wrap: wrap;
    }
  }
`;

export const ToppingsGrid = styled.div`
  display: grid; 
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); 
  gap: 10px; 
  background-color: #fff; 
  border: 1px solid #ddd; 
  padding: 15px; 
  border-radius: 6px;
`;

export const ToppingCheckboxLabel = styled.label`
  display: flex; 
  align-items: center; 
  gap: 8px; 
  font-size: 0.9em; 
  cursor: pointer; 
  
  input { 
    width: 16px; 
    height: 16px; 
  }
`;

export const InfoText = styled.p`
  background-color: #f0f4f8; 
  border-left: 4px solid #7c3aed;
  padding: 15px; 
  border-radius: 4px; 
  color: #333;
`;