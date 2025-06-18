// src/pages/Admin/CategoriesPage/styles.js
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

export const AddForm = styled.form`
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

export const FormGroup = styled.div`
  display: flex; 
  flex-direction: column; 

  label { 
    margin-bottom: 8px;
    font-weight: 600; 
    color: #444; 
  } 

  input[type="text"] { 
    padding: 12px;
    border: 1px solid #ccc; 
    border-radius: 6px; 
    font-size: 1em; 
    background-color: #f8fafc;
  }
`;

export const FormActions = styled.div`
  display: flex; 
  gap: 10px; 
  margin-top: 10px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

export const CategoryList = styled.ul`
  list-style: none; 
  padding: 0; 
  margin-top: 10px;
`;

export const CategoryListItem = styled.li`
  background-color: #fff; 
  padding: 15px 20px;
  border: 1px solid #e2e8f0;
  border-radius: 6px; 
  margin-bottom: 10px; 
  display: flex; 
  justify-content: space-between; 
  align-items: center; 
  font-size: 1.05em; 
  color: #333;
  flex-wrap: wrap;
  gap: 15px;

  .category-name {
    font-weight: 500;
    word-break: break-word;
    margin-right: 15px;
  }

  .category-actions {
    display: flex;
    gap: 8px;
    flex-shrink: 0;

    button { 
      padding: 6px 12px;
      font-size: 0.9em; 
    }
  }

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;

    .category-actions {
      width: 100%;
      justify-content: flex-end;
    }
  }
`;

export const LoadingText = styled.p`
  text-align: center; 
  color: #555; 
  font-style: italic; 
  margin-top: 20px;
`;

export const InfoText = styled.p`
  background-color: #eef2ff;
  border-left: 4px solid #6366f1;
  padding: 15px;
  border-radius: 4px;
  color: #333;
  margin-top: 0;
`;