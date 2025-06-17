// src/utils/priceCalculator.js

/**
 * Calcula o preço final de um item com base no tamanho e adicionais.
 * @param {object | null} product - O objeto do produto base (pode ser nulo para combos).
 * @param {object | null} selectedSize - O objeto do tamanho selecionado.
 * @param {number} selectedSize.price - O PREÇO TOTAL para este tamanho.
 * @param {string[]} selectedToppings - Um array com os IDs dos adicionais selecionados.
 * @param {object[]} availableToppings - A lista completa de todos os adicionais disponíveis.
 * @param {object | null} activePromo - A promoção ativa para este item, se houver.
 * @returns {number} - O preço final calculado.
 */
export const calculateAcaiPrice = (product, selectedSize, selectedToppings, availableToppings, activePromo) => {
  let finalPrice = 0;

  // 1. Define o preço base.
  // Se for uma promoção com preço fixo, usa esse preço.
  if (activePromo && activePromo.price !== undefined) {
    finalPrice = activePromo.price;
  } 
  // Senão, o preço base é o preço do tamanho selecionado.
  else if (selectedSize && selectedSize.price !== undefined) {
    finalPrice = selectedSize.price;
  }
  // Fallback para o preço do produto caso não haja tamanho (itens que não são açaí)
  else if (product) {
    finalPrice = product.price;
  }
  
  // 2. Adiciona o preço dos adicionais que não fazem parte da promoção
  if (selectedToppings.length > 0 && availableToppings.length > 0) {
    const selectedToppingsObjects = selectedToppings
      .map(id => availableToppings.find(t => t.id === id))
      .filter(Boolean);

    const promoToppingIds = activePromo?.rules?.allowed_topping_ids || [];

    selectedToppingsObjects.forEach(topping => {
      if (!promoToppingIds.includes(topping.id)) {
        finalPrice += topping.price;
      }
    });
  }

  return finalPrice;
};