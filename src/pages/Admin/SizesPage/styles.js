// src/pages/Admin/SizesPage/styles.js
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

export const FormGroup = styled.div`
  display: flex; 
  flex-direction: column; 

  label { 
    margin-bottom: 8px;
    font-weight: 600; 
    color: #444; 
  } 

  input { 
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

export const InfoText = styled.p`
  background-color: #eef2ff;
  border-left: 4px solid #6366f1;
  padding: 15px;
  border-radius: 4px;
  color: #333;
  margin: 20px 0;
`;

export const SizeList = styled.ul`
  list-style: none; 
  padding: 0; 
  margin-top: 10px;
`;

export const SizeListItem = styled.li`
  background-color: #fff; 
  padding: 15px 20px;
  border: 1px solid #e2e8f0;
  border-radius: 6px; 
  margin-bottom: 10px; 
  display: flex; 
  justify-content: space-between; 
  align-items: center; 
  flex-wrap: wrap;
  gap: 15px;
`;

export const SizeInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;

  .size-name {
    font-weight: 500;
    font-size: 1.05em; 
    color: #333;
  }

  .size-price {
    font-size: 0.9em;
    color: #555;
  }
`;

export const SizeActions = styled.div`
  display: flex;
  gap: 8px;
  flex-shrink: 0;

  button { 
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