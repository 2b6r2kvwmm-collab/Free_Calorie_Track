// Open Food Facts API utilities

const API_BASE = 'https://world.openfoodfacts.org';

export async function searchFoods(query) {
  try {
    const response = await fetch(
      `${API_BASE}/cgi/search.pl?search_terms=${encodeURIComponent(query)}&page_size=20&json=true&fields=product_name,nutriments,serving_size,brands,code`
    );

    if (!response.ok) {
      throw new Error('Search failed');
    }

    const data = await response.json();

    return data.products.map(product => {
      const nutriments = product.nutriments || {};

      // Helper function to get nutrient value
      const getNutrient = (servingKey, per100gKey) => {
        const servingValue = nutriments[servingKey];
        const per100gValue = nutriments[per100gKey];

        // Use serving value if it exists and is > 0, otherwise use 100g value
        if (servingValue && servingValue > 0) return servingValue;
        if (per100gValue && per100gValue > 0) return per100gValue;
        return 0;
      };

      // Get calories
      const calories = Math.round(getNutrient('energy-kcal_serving', 'energy-kcal_100g'));

      // Get macros with multiple possible field names
      const protein = getNutrient('proteins_serving', 'proteins_100g') ||
                     getNutrient('proteins', 'proteins');

      const carbs = getNutrient('carbohydrates_serving', 'carbohydrates_100g') ||
                   getNutrient('carbohydrates', 'carbohydrates');

      const fat = getNutrient('fat_serving', 'fat_100g') ||
                 getNutrient('fat', 'fat');

      return {
        name: product.product_name || 'Unknown Product',
        brand: product.brands || '',
        calories,
        protein: Math.round(protein * 10) / 10,
        carbs: Math.round(carbs * 10) / 10,
        fat: Math.round(fat * 10) / 10,
        servingSize: product.serving_size || '100g',
        barcode: product.code,
      };
    }).filter(food => food.calories > 0);
  } catch (error) {
    console.error('Error searching foods:', error);
    return [];
  }
}

export async function getFoodByBarcode(barcode) {
  try {
    const response = await fetch(`${API_BASE}/api/v0/product/${barcode}.json`);

    if (!response.ok) {
      throw new Error('Barcode lookup failed');
    }

    const data = await response.json();

    if (data.status === 0) {
      return null; // Product not found
    }

    const product = data.product;
    const nutriments = product.nutriments || {};

    // Helper function to get nutrient value
    const getNutrient = (servingKey, per100gKey) => {
      const servingValue = nutriments[servingKey];
      const per100gValue = nutriments[per100gKey];

      // Use serving value if it exists and is > 0, otherwise use 100g value
      if (servingValue && servingValue > 0) return servingValue;
      if (per100gValue && per100gValue > 0) return per100gValue;
      return 0;
    };

    // Get calories
    const calories = Math.round(getNutrient('energy-kcal_serving', 'energy-kcal_100g'));

    // Get macros with multiple possible field names
    const protein = getNutrient('proteins_serving', 'proteins_100g') ||
                   getNutrient('proteins', 'proteins');

    const carbs = getNutrient('carbohydrates_serving', 'carbohydrates_100g') ||
                 getNutrient('carbohydrates', 'carbohydrates');

    const fat = getNutrient('fat_serving', 'fat_100g') ||
               getNutrient('fat', 'fat');

    return {
      name: product.product_name || 'Unknown Product',
      brand: product.brands || '',
      calories,
      protein: Math.round(protein * 10) / 10,
      carbs: Math.round(carbs * 10) / 10,
      fat: Math.round(fat * 10) / 10,
      servingSize: product.serving_size || '100g',
      barcode: product.code,
    };
  } catch (error) {
    console.error('Error looking up barcode:', error);
    return null;
  }
}
