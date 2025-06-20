// src/pages/Admin/SizesPage/styles.js

import styled from 'styled-components';

export const Title = styled.h2`
  color: #333;
  margin-bottom: 20px;
`;

export const FormContainer = styled.div`
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  margin-bottom: 30px;
`;

export const FormRow = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 15px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0;
  }
`;

export const InputGroup = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    margin-bottom: 15px;
  }
`;

export const Label = styled.label`
  margin-bottom: 5px;
  font-weight: 500;
  color: #555;
`;

export const Input = styled.input`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1em;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

export const Thead = styled.thead`
  background-color: #f8f9fa;
`;

export const Tr = styled.tr`
  &:nth-child(even) {
    background-color: #f2f2f2;
  }
`;

export const Th = styled.th`
  padding: 12px 15px;
  text-align: left;
  border-bottom: 2px solid #dee2e6;
  color: #495057;
`;

export const Td = styled.td`
  padding: 12px 15px;
  border-bottom: 1px solid #dee2e6;
  vertical-align: middle;
`;

export const ActionsTd = styled(Td)`
  display: flex;
  gap: 10px;
  align-items: center;
  height: 65px;
`;

export const LoadingMessage = styled.p`
  color: #555;
  font-style: italic;
`;