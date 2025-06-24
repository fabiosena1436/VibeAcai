// src/pages/Admin/ProductsPage/styles.js

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
  border: 1px solid #eee;
  grid-template-columns: 1fr;
  gap: 15px;

  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
    
    .form-group-description {
      grid-column: 1 / -1;
    }
    .full-width {
      grid-column: 1 / -1;
    }
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
  
  input[type="text"], 
  input[type="number"], 
  textarea, 
  select,
  input[type="checkbox"] { 
    padding: 10px; 
    border: 1px solid #ccc; 
    border-radius: 6px; 
    font-size: 1em; 
    background-color: white; 
    width: 100%;
    box-sizing: border-box;
  } 
  
  textarea { 
    min-height: 80px; 
    resize: vertical; 
  }
`;

export const FormActions = styled.div`
  display: flex; 
  gap: 10px; 
  margin-top: 10px;
  grid-column: 1 / -1;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

export const ProductList = styled.ul`
  list-style: none; 
  padding: 0;
`;

export const ProductListItem = styled.li`
  background-color: #fff;
  padding: 15px; 
  border-radius: 8px; 
  margin-bottom: 15px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.08);
  display: grid;
  grid-template-columns: 100px 1fr auto; 
  gap: 20px; 
  align-items: center; 
  position: relative;

  .product-image-container {
    width: 100px; 
    height: 100px; 
    border-radius: 6px;
    overflow: hidden; 
    background-color: #f0f0f0;
    
    img { 
      width: 100%; 
      height: 100%; 
      object-fit: cover; 
    }
  }
  
  .product-content {
    display: flex; 
    flex-direction: column; 
    gap: 8px; 
    text-align: left;
  }
  
  .product-name {
    font-weight: bold; 
    font-size: 1.2em; 
    color: #333; 
    margin: 0;
  }
  
  .product-description {
    font-size: 0.9em; 
    color: #666; 
    line-height: 1.4; 
    display: -webkit-box;
    -webkit-line-clamp: 2; 
    -webkit-box-orient: vertical; 
    overflow: hidden;
    text-overflow: ellipsis; 
    margin: 0;
  }
  
  .product-details {
    display: flex; 
    flex-wrap: wrap; 
    gap: 10px 20px; 
    font-size: 0.9em; 
    color: #555;
  }
  
  .product-price strong { 
    color: #7c3aed; 
    font-size: 1.1em; 
  }
  
  .product-category strong { 
    text-transform: capitalize; 
  }
  
  .product-status {
    font-weight: bold;
    &.available { color: #16a34a; }
    &.unavailable { color: #b91c1c; }
  }
  
  .product-actions {
    display: flex; 
    flex-direction: column; 
    gap: 8px;
    
    button { 
      padding: 8px 10px; 
      font-size: 0.85em; 
      width: 100%; 
      min-width: 110px; 
    }
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 15px;

    .product-image-container {
      width: 100%; 
      height: 180px;
    }
    
    .product-content {
      text-align: center;
    }
    
    .product-details {
      justify-content: center;
    }
    
    .product-actions {
      flex-direction: row;
      flex-wrap: wrap;
      
      button {
        flex-grow: 1;
        min-width: calc(50% - 4px);
      }
    }
  }
`;

export const LoadingText = styled.p`
  text-align: center; 
  color: #555; 
  font-style: italic; 
  margin-top: 20px;
`;

export const StarIcon = styled.div`
  position: absolute; 
  top: 5px; 
  right: 5px; 
  font-size: 1.8em;
  color: #7c3aed; 
  pointer-events: none;
  text-shadow: 0 0 5px rgba(0,0,0,0.3);
`;

export const InfoText = styled.p`
  background-color: #f0f4f8; 
  border-left: 4px solid #7c3aed;
  padding: 15px; 
  border-radius: 4px; 
  color: #333;
`;

// --- ESTILOS NOVOS ADICIONADOS ---
export const SizeManagementContainer = styled.div`
  grid-column: 1 / -1;
  background-color: #f0f0f0;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  margin-top: 10px;
`;

export const SizeInputGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr auto;
  gap: 10px;
  align-items: center;
  margin-bottom: 15px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const SizeList = styled.ul`
  list-style: none;
  padding: 0;
`;

export const SizeListItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
  padding: 8px 12px;
  border-radius: 4px;
  margin-bottom: 5px;
  font-size: 0.9em;

  button {
    background: none;
    border: none;
    color: #dc2626;
    cursor: pointer;
    font-size: 1.1em;
  }
`;