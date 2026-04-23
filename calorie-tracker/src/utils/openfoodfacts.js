// Open Food Facts API utilities

const API_BASE = 'https://world.openfoodfacts.org';
const MAX_RESPONSE_SIZE = 2 * 1024 * 1024; // 2MB limit for API responses

/**
 * Validates response size to prevent memory issues from oversized responses
 * @param {Response} response - Fetch API response object
 * @returns {Promise<Object>} - Parsed JSON if valid
 * @throws {Error} - If response is too large
 */
async function validateAndParseResponse(response) {
  const contentLength = response.headers.get('content-length');

  // Check content-length header if available
  if (contentLength && parseInt(contentLength) > MAX_RESPONSE_SIZE) {
    throw new Error('Response size exceeds limit');
  }

  // Read response as text first to check size
  const text = await response.text();

  if (text.length > MAX_RESPONSE_SIZE) {
    throw new Error('Response size exceeds limit');
  }

  // Check if response is HTML instead of JSON
  if (text.trim().startsWith('<!DOCTYPE') || text.trim().startsWith('<html')) {
    throw new Error('API returned HTML instead of JSON - service may be unavailable');
  }

  try {
    return JSON.parse(text);
  } catch (error) {
    console.error('JSON parse error:', error);
    console.error('Response text (first 200 chars):', text.substring(0, 200));
    throw new Error(`Failed to parse API response: ${error.message}`);
  }
}

export async function searchFoods(query, signal = null) {
  try {
    // Use v1 search API - v2 does not support full text search
    // Documentation: "only v1 search API supports full text search"
    const url = `${API_BASE}/cgi/search.pl?search_terms=${encodeURIComponent(query)}&page_size=20&json=1`;

    const response = await fetch(url, { signal });

    if (!response.ok) {
      console.error(`Open Food Facts API returned status ${response.status}`);
      console.error('Response headers:', Object.fromEntries(response.headers.entries()));

      // Try to read response body for more details
      try {
        const errorText = await response.text();
        console.error('Error response body (first 500 chars):', errorText.substring(0, 500));
      } catch (e) {
        console.error('Could not read error response body:', e);
      }

      if (response.status === 403) {
        throw new Error(`Rate limit reached (403). You've searched too many times.`);
      }
      if (response.status === 503) {
        throw new Error(`Open Food Facts API is temporarily unavailable (503). The service is experiencing high load or maintenance. Please try again in a few minutes.`);
      }
      throw new Error(`Search failed with status ${response.status}`);
    }

    const data = await validateAndParseResponse(response);

    if (!data || !Array.isArray(data.products)) {
      console.error('Invalid API response structure:', data);
      throw new Error('Invalid API response');
    }

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

      const fiber = getNutrient('fiber_serving', 'fiber_100g') ||
                   getNutrient('fiber', 'fiber');
      // OFF sodium is stored in grams; multiply by 1000 for mg
      const sodiumG = getNutrient('sodium_serving', 'sodium_100g') ||
                     getNutrient('sodium', 'sodium');
      const sodium = Math.round(sodiumG * 1000);
      const sugar = getNutrient('sugars_serving', 'sugars_100g') ||
                   getNutrient('sugars', 'sugars');
      const saturatedFat = getNutrient('saturated-fat_serving', 'saturated-fat_100g') ||
                          getNutrient('saturated-fat', 'saturated-fat');

      return {
        name: product.product_name || 'Unknown Product',
        brand: product.brands || '',
        calories,
        protein: Math.round(protein * 10) / 10,
        carbs: Math.round(carbs * 10) / 10,
        fat: Math.round(fat * 10) / 10,
        fiber: Math.round(fiber * 10) / 10,
        sodium,
        sugar: Math.round(sugar * 10) / 10,
        saturatedFat: Math.round(saturatedFat * 10) / 10,
        servingSize: product.serving_size || '100g',
        barcode: product.code,
      };
    }).filter(food => food.calories > 0);
  } catch (error) {
    console.error('Error searching foods:', error);
    throw error; // Re-throw so FoodSearch can handle it
  }
}

export async function getFoodByBarcode(barcode, signal = null) {
  try {
    const response = await fetch(
      `${API_BASE}/api/v0/product/${barcode}.json`,
      { signal }
    );

    if (!response.ok) {
      throw new Error('Barcode lookup failed');
    }

    const data = await validateAndParseResponse(response);

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

    const fiber = getNutrient('fiber_serving', 'fiber_100g') ||
                 getNutrient('fiber', 'fiber');
    // OFF sodium is stored in grams; multiply by 1000 for mg
    const sodiumG = getNutrient('sodium_serving', 'sodium_100g') ||
                   getNutrient('sodium', 'sodium');
    const sodium = Math.round(sodiumG * 1000);
    const sugar = getNutrient('sugars_serving', 'sugars_100g') ||
                 getNutrient('sugars', 'sugars');
    const saturatedFat = getNutrient('saturated-fat_serving', 'saturated-fat_100g') ||
                        getNutrient('saturated-fat', 'saturated-fat');

    return {
      name: product.product_name || 'Unknown Product',
      brand: product.brands || '',
      calories,
      protein: Math.round(protein * 10) / 10,
      carbs: Math.round(carbs * 10) / 10,
      fat: Math.round(fat * 10) / 10,
      fiber: Math.round(fiber * 10) / 10,
      sodium,
      sugar: Math.round(sugar * 10) / 10,
      saturatedFat: Math.round(saturatedFat * 10) / 10,
      servingSize: product.serving_size || '100g',
      barcode: product.code,
    };
  } catch (error) {
    console.error('Error looking up barcode:', error);
    return null;
  }
}
