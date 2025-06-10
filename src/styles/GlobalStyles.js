import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  /* Reset básico e configurações globais */
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    overflow-x: hidden;
    scroll-behavior: smooth;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    overflow-x: hidden;
    position: relative;
    min-height: 100vh;
    background-color: #f8f9fa;
    color: #333;
  }

  #root {
    overflow-x: hidden;
    min-height: 100vh;
  }

  /* Previne overflow horizontal em todos os elementos */
  * {
    max-width: 100vw;
  }

  /* Remove scrollbar horizontal mas mantém a funcionalidade se necessário */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  ::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #555;
  }

  /* Ajuste para elementos que possam causar overflow */
  img, video, iframe {
    max-width: 100%;
    height: auto;
  }

  /* Correção para elementos position fixed */
  .fixed-element {
    position: fixed;
    left: 0;
    right: 0;
  }

  /* Links */
  a {
    color: inherit;
    text-decoration: none;
    transition: color 0.2s ease;
  }

  /* Listas */
  ul, ol {
    list-style: none;
  }

  /* Botões */
  button {
    cursor: pointer;
    border: none;
    background: none;
    font: inherit;
    transition: all 0.2s ease;
  }

  button:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }

  /* Inputs e Textareas */
  input, textarea, select {
    font: inherit;
  }

  /* Acessibilidade */
  :focus {
    outline: 2px solid #7c3aed;
    outline-offset: 2px;
  }

  /* Classes utilitárias */
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }

  .container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
  }

  .text-center {
    text-align: center;
  }

  .mt-1 { margin-top: 0.25rem; }
  .mt-2 { margin-top: 0.5rem; }
  .mt-3 { margin-top: 1rem; }
  .mt-4 { margin-top: 1.5rem; }
  .mt-5 { margin-top: 2rem; }

  .mb-1 { margin-bottom: 0.25rem; }
  .mb-2 { margin-bottom: 0.5rem; }
  .mb-3 { margin-bottom: 1rem; }
  .mb-4 { margin-bottom: 1.5rem; }
  .mb-5 { margin-bottom: 2rem; }

  /* Animações */
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes slideIn {
    from {
      transform: translateX(-100%);
    }
    to {
      transform: translateX(0);
    }
  }

  @keyframes pulse {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.05);
    }
    100% {
      transform: scale(1);
    }
  }

  /* Responsividade base */
  @media (max-width: 768px) {
    body {
      font-size: 14px;
    }
    
    .container {
      padding: 0 15px;
    }
  }

  @media (max-width: 480px) {
    body {
      font-size: 13px;
    }
    
    .container {
      padding: 0 10px;
    }
  }
`;

export default GlobalStyles;