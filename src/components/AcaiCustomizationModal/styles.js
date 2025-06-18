import styled from 'styled-components';

export const SectionTitle = styled.h2`
  font-size: 1.4em;
  color: #4a4a4a;
  margin: 25px 0 15px 0;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;

  &:first-of-type {
    margin-top: 0;
  }
`;

export const OptionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 10px;
`;

export const OptionItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  border: 2px solid ${({ $isSelected }) => ($isSelected ? '#7c3aed' : '#ddd')};
  background-color: ${({ $isSelected }) => ($isSelected ? '#f3e8ff' : '#fff')};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  font-weight: ${({ $isSelected }) => ($isSelected ? 'bold' : 'normal')};
  color: ${({ $isSelected }) => ($isSelected ? '#5b21b6' : '#333')};

  ${({ $isTopping }) =>
    $isTopping &&
    `
    flex-direction: column;
    align-items: flex-start;
    cursor: default;
    border-color: #eee;
    background-color: #fafafa;
  `}

  &:hover {
    border-color: #7c3aed;
  }

  span {
    flex-grow: 1;
  }
`;

export const Counter = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 8px;

  button {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    border: 1px solid #ccc;
    background-color: #fff;
    color: #5b21b6;
    font-size: 1.2em;
    font-weight: bold;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;

    &:disabled {
      background-color: #f0f0f0;
      color: #aaa;
      cursor: not-allowed;
    }
  }

  span {
    font-size: 1.1em;
    font-weight: bold;
    min-width: 20px;
    text-align: center;
  }
`;

export const ToppingCategory = styled.h3`
  font-size: 1.1em;
  color: #666;
  margin: 20px 0 10px 0;
  text-transform: capitalize;
`;

export const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  font-size: 1.2em;
  color: #666;
  font-style: italic;
`;