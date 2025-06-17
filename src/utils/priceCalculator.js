// src/utils/priceCalculator.js

/**
 * Calcula o preço final de um item de açaí com base no tamanho, adicionais e promoções.
 *
 * @param {object} product - O objeto do produto base.
 * @param {number} product.price - O preço base do produto.
 * @param {object|null} selectedSize - O objeto do tamanho selecionado.
 * @param {number} selectedSize.priceModifier - O valor a ser adicionado ao preço base pelo tamanho.
 * @param {string[]} selectedToppings - Um array com os IDs dos adicionais selecionados.
 * @param {object[]} availableToppings - A lista completa de todos os adicionais disponíveis na loja.
 * @param {object|null} activePromo - A promoção ativa para este item, se houver.
 * @param {number} [activePromo.price] - Preço fixo da promoção.
 * @param {object} [activePromo.rules] - Regras da promoção.
 * @param {string[]} [activePromo.rules.allowed_topping_ids] - IDs dos adicionais inclusos na promoção.
 * @returns {number} - O preço final calculado.
 */
export const calculateAcaiPrice = (product, selectedSize, selectedToppings, availableToppings, activePromo) => {
    if (!product) {
      return 0;
    }
  
    let finalPrice;
  
    // 1. Define o preço base (preço da promoção ou preço do produto + tamanho)
    if (activePromo && activePromo.price !== undefined) {
      finalPrice = activePromo.price;
    } else if (selectedSize) {
      finalPrice = product.price + (selectedSize.priceModifier || 0);
    } else {
      finalPrice = product.price;
    }
  
    // 2. Adiciona o preço dos adicionais que não fazem parte da promoção
    if (selectedToppings.length > 0 && availableToppings.length > 0) {
      const selectedToppingsObjects = selectedToppings
        .map(id => availableToppings.find(t => t.id === id))
        .filter(Boolean); // Garante que não há adicionais nulos
  
      const promoToppingIds = activePromo?.rules?.allowed_topping_ids || [];
  
      selectedToppingsObjects.forEach(topping => {
        // Adiciona o preço do adicional apenas se ele NÃO estiver incluso na promoção
        if (!promoToppingIds.includes(topping.id)) {
          finalPrice += topping.price;
        }
      });
    }
  
    return finalPrice;
  };