// src/pages/Admin/SettingsPage/styles.js
import styled from 'styled-components';

export const SettingsWrapper = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

export const Title = styled.h1`
  font-size: 2em;
  color: #333;
  margin-bottom: 30px;
`;

export const SettingsForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

export const FormSection = styled.div`
  background-color: #ffffff;
  padding: 25px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
`;

export const SectionTitle = styled.h2`
  font-size: 1.5em; 
  color: #555; 
  margin-top: 0; 
  margin-bottom: 25px; 
  border-bottom: 1px solid #ddd; 
  padding-bottom: 10px;
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;

  &:last-child {
    margin-bottom: 0;
  }

  label { 
    margin-bottom: 8px;
    font-weight: 600; 
    color: #444; 
  } 

  input[type="number"] { 
    padding: 12px;
    border: 1px solid #ccc; 
    border-radius: 6px; 
    font-size: 1em; 
    background-color: #f8fafc;
    max-width: 200px;
  }
`;

export const SwitchContainer = styled.label`
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  margin-bottom: 20px;

  .switch-wrapper {
    position: relative;
    display: inline-block;
    width: 50px;
    height: 28px;
  }
`;

export const SwitchLabel = styled.span`
  font-size: 1.05em;
  color: #333;
`;

export const SwitchInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;

  &:checked + span {
    background-color: #7c3aed;
  }

  &:checked + span:before {
    transform: translateX(22px);
  }
`;

export const SwitchSlider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  border-radius: 34px;
  transition: .4s;

  &:before {
    position: absolute;
    content: "";
    height: 20px;
    width: 20px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    border-radius: 50%;
    transition: .4s;
  }
`;