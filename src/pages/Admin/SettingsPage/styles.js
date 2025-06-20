// src/pages/Admin/SettingsPage/styles.js

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

export const Form = styled.form`
  background-color: #f9f9f9; 
  padding: 20px; 
  border-radius: 8px; 
  margin-top: 10px; 
  display: flex; 
  flex-direction: column; 
  gap: 15px; 
  border: 1px solid #eee;
  height: 100%; 
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
  textarea { 
    padding: 10px; 
    border: 1px solid #ccc; 
    border-radius: 6px; 
    font-size: 1em; 
    background-color: white; 
  }
  
  textarea { 
    min-height: 100px; 
    resize: vertical; 
  }
  
  p { 
    font-size: 0.9em; 
    margin-top: 5px; 
    color: #666; 
  }
  
  img {
    max-width: 100%; 
    height: auto;
    margin-top: 10px; 
    border-radius: 8px; 
    border: 1px solid #ddd;
  }
`;

export const LoadingText = styled.p`
  text-align: center; 
  color: #555; 
  font-style: italic; 
  margin-top: 20px;
`;

export const StatusDisplay = styled.div`
  margin-bottom: 10px; 
  font-size: 1.1em; 
  font-weight: bold;
  color: ${props => props.isOpen ? '#16a34a' : '#b91c1c'};
`;

export const SettingsBlock = styled.div`
  padding: 20px; 
  background-color: #f9f9f9;
  border-radius: 8px; 
  border: 1px solid #eee;
`;

export const SettingsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  margin-bottom: 40px;

  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
`;