// Nenhum erro aqui, apenas confirmando o nome da função exportada
export const calculateAcaiPrice = (product, selectedSize, selectedToppings, toppings, promotion) => {
  let total = 0;

  // Se houver promoção de preço fixo para o combo, use-a.
  if (promotion?.type === 'free_toppings_selection' && promotion.promotionalPrice) {
    return promotion.promotionalPrice;
  }
  
  // Se for um desconto de produto e tiver um tamanho selecionado, comece com o preço do tamanho.
  // Caso contrário, comece com o preço base do produto (que pode ser promocional).
  if (selectedSize) {
    total += selectedSize.price;
  } else if (product) {
    total += promotion?.type === 'product_discount' ? promotion.promotionalPrice : product.price;
  }

  // Adicionar o preço dos adicionais
  const isFreeToppingPromo = promotion?.type === 'free_toppings_selection';
  const freeToppingsLimit = isFreeToppingPromo ? promotion.rules.selection_limit : 0;
  let toppingsCount = 0;

  for (const toppingId in selectedToppings) {
    const quantity = selectedToppings[toppingId];
    if (quantity > 0) {
      const toppingDetails = toppings.find(t => t.id === toppingId);
      if (toppingDetails) {
        for (let i = 0; i < quantity; i++) {
          toppingsCount++;
          // Adiciona o preço apenas se não for uma promoção de adicionais grátis
          // ou se o limite de adicionais grátis já foi ultrapassado.
          if (!isFreeToppingPromo || toppingsCount > freeToppingsLimit) {
            total += toppingDetails.price;
          }
        }
      }
    }
  }

  return total;
};