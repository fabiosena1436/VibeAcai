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
  background-color: #f9f9f9; 
  padding: 20px; 
  border-radius: 8px; 
  margin-top: 10px; 
  margin-bottom: 40px; 
  display: flex; 
  flex-direction: column; 
  gap: 15px; 
  border: 1px solid #eee;
`;

export const FormGroup = styled.div`
  display: flex; 
  flex-direction: column; 

  label { 
    margin-bottom: 5px; 
    font-weight: 600; 
    color: #444; 
  } 

  input[type="text"] { 
    padding: 10px; 
    border: 1px solid #ccc; 
    border-radius: 6px; 
    font-size: 1em; 
    background-color: white; 
  }
`;

export const FormActions = styled.div`
  display: flex; 
  gap: 10px; 
  margin-top: 10px;

  /* Em telas pequenas, os botões se empilham */
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch; /* Faz os botões ocuparem 100% da largura */
  }
`;

export const CategoryList = styled.ul`
  list-style: none; 
  padding: 0; 
  margin-top: 10px;
`;

export const CategoryListItem = styled.li`
  background-color: #fff; 
  padding: 15px; /* Aumenta um pouco o padding para toque */
  border: 1px solid #eee; 
  border-radius: 6px; 
  margin-bottom: 10px; 
  display: flex; 
  justify-content: space-between; 
  align-items: center; 
  font-size: 1em; 
  color: #333;
  flex-wrap: wrap; /* Permite que os itens quebrem linha se necessário */

  .category-name {
    font-weight: 500;
    word-break: break-word; /* Quebra palavras longas para não estourar o layout */
    margin-right: 15px; /* Espaço entre o nome e os botões */
  }

  .category-actions {
    display: flex;
    gap: 8px;
    flex-shrink: 0; /* Impede que os botões encolham */

    button { 
      padding: 6px 10px; 
      font-size: 0.9em; 
    }
  }

  /* Em telas pequenas, o layout do item da lista muda */
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start; /* Alinha tudo à esquerda */
    gap: 15px; /* Espaço entre o nome e a área de botões */

    .category-actions {
      width: 100%; /* Ocupa toda a largura */
      justify-content: flex-end; /* Alinha os botões à direita */
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
  background-color: #f0f4f8;
  border-left: 4px solid #7c3aed;
  padding: 15px;
  border-radius: 4px;
  color: #333;
`;