// src/pages/Admin/PromotionsPage/styles.js
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
`;

export const Form = styled.form`
  background-color: #ffffff;
  padding: 25px;
  border-radius: 8px;
  margin-bottom: 40px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
`;

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const FormGroup = styled.div`
  display: flex; 
  flex-direction: column; 

  label { 
    margin-bottom: 8px;
    font-weight: 600; 
    color: #444; 
  } 

  input, select, textarea { 
    padding: 12px;
    border: 1px solid #ccc; 
    border-radius: 6px; 
    font-size: 1em; 
    background-color: #f8fafc;
  }

  textarea {
    resize: vertical;
    min-height: 100px;
    grid-column: 1 / -1; // Ocupa a linha inteira no grid
  }
`;

export const CheckboxGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 5px;
  
  label {
    margin: 0;
    font-weight: normal;
  }

  input[type="checkbox"] {
    width: 18px;
    height: 18px;
  }
`;

export const CheckboxGrid = styled.div`
    grid-column: 1 / -1;
    border: 1px solid #ddd;
    border-radius: 6px;
    padding: 15px;

    h4 {
        margin-top: 0;
        margin-bottom: 10px;
        color: #444;
    }
    
    .items {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 10px;
    }
`;

export const FormActions = styled.div`
  display: flex; 
  gap: 10px; 
  margin-top: 10px;
`;

export const PromotionList = styled.ul`
  list-style: none; 
  padding: 0; 
  margin-top: 10px;
`;

export const PromotionListItem = styled.li`
  background-color: #fff; 
  padding: 20px;
  border: 1px solid #e2e8f0;
  border-radius: 8px; 
  margin-bottom: 15px; 
  display: flex; 
  justify-content: space-between; 
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 15px;
`;

export const PromotionInfo = styled.div`
  flex-grow: 1;

  h3 {
    margin: 0 0 10px 0;
    color: #4a044e;
  }

  p {
    margin: 4px 0;
    font-size: 0.95em;
    color: #555;
    line-height: 1.5;
  }
  
  strong {
      color: #333;
  }
`;

export const PromotionActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex-shrink: 0;
  align-self: flex-start;

  button { 
    width: 100%;
    padding: 6px 12px;
    font-size: 0.9em; 
  }
`;

export const LoadingText = styled.p`
  text-align: center; 
  color: #555; 
  font-style: italic; 
  margin-top: 20px;
`;