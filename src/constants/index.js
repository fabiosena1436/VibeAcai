// src/constants/index.js

/**
 * Contém os tamanhos de açaí disponíveis, com seus nomes e modificadores de preço.
 */
export const AÇAI_SIZES = [
    { id: 'P', name: 'Pequeno (300ml)', priceModifier: 0 },
    { id: 'M', name: 'Médio (500ml)', priceModifier: 4.00 },
    { id: 'G', name: 'Grande (700ml)', priceModifier: 8.00 },
  ];
  
  /**
   * O ID do documento no Firestore que armazena as configurações principais da loja.
   */
  export const STORE_SETTINGS_DOC_ID = "mainConfig";