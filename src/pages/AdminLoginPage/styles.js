// src/pages/AdminLoginPage/styles.js

import styled from 'styled-components';

export const LoginPageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh; 
  padding: 20px;
  background-color: #e9d5ff; 
`;

export const LoginForm = styled.form`
  background-color: #fff;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const Title = styled.h1`
  color: #7c3aed;
  text-align: center;
  margin-bottom: 10px;
`;

export const FormGroup = styled.div`
  label {
    display: block;
    margin-bottom: 8px;
    font-weight: 600;
    color: #555;
  }
  
  input {
    width: 100%;
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 1em;
    box-sizing: border-box;
    
    &:focus {
      border-color: #7c3aed;
      outline: none;
      box-shadow: 0 0 0 2px rgba(124, 58, 237, 0.2);
    }
  }
`;

export const ErrorMessage = styled.p`
  color: #ef4444;
  font-size: 0.9em;
  text-align: center;
  margin-top: -10px;
  margin-bottom: 10px;
`;