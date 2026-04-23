// USDA FoodData Central API utilities
// Documentation: https://fdc.nal.usda.gov/api-guide/

const API_BASE = 'https://api.nal.usda.gov/fdc/v1';

// IMPORTANT: Get your own free API key at https://fdc.nal.usda.gov/api-key-signup
// The DEMO_KEY has very limited rate limits and should only be used for testing
const API_KEY = import.meta.env.VITE_USDA_API_KEY || 'DEMO_KEY';

/**
 * Search for branded foods in USDA FoodData Central database
 * @param {string} query - Search term
 * @param {AbortSignal} signal - Optional abort signal for cancellation
 * @returns {Promise<Array>} - Array of food objects
 */
export async function searchFoods(query, signal = null) {
  try {
    const url = `${API_BASE}/foods/search?api_key=${API_KEY}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: query,
        dataType: ['Branded'], // Only search branded foods
        pageSize: 20,
        sortBy: 'dataType.keyword',
        sortOrder: 'asc',
      }),
      signal,
    });

    if (!response.ok) {
      console.error(`USDA API returned status ${response.status}`);

      if (response.status === 403) {
        throw new Error('API key limit reached. Please get a free API key at https://fdc.nal.usda.gov/api-key-signup');
      }
      if (response.status === 429) {
        throw new Error('Rate limit exceeded (1000 requests/hour). Please try again later.');
      }

      throw new Error(`Search failed with status ${response.status}`);
    }

    const data = await response.json();

    if (!data || !Array.isArray(data.foods)) {
      console.error('Invalid USDA API response structure:', data);
      throw new Error('Invalid API response');
    }

    // Map USDA format to our app's expected format
    return data.foods.map(food => {
      const nutrients = food.foodNutrients || [];

      // Helper to find nutrient by ID
      const getNutrient = (nutrientId) => {
        const nutrient = nutrients.find(n => n.nutrientId === nutrientId);
        return nutrient ? nutrient.value : 0;
      };

      // USDA Nutrient IDs:
      // 1008 = Energy (kcal), 1003 = Protein, 1005 = Carbohydrate, 1004 = Total lipid (fat)
      // 1079 = Fiber, 1093 = Sodium (mg), 2000 = Total Sugars, 1063 = Sugars fallback
      // 1258 = Saturated fat

      const calories = Math.round(getNutrient(1008));
      const protein = Math.round(getNutrient(1003) * 10) / 10;
      const carbs = Math.round(getNutrient(1005) * 10) / 10;
      const fat = Math.round(getNutrient(1004) * 10) / 10;
      const fiber = Math.round(getNutrient(1079) * 10) / 10;
      const sodium = Math.round(getNutrient(1093));
      const sugar = Math.round((getNutrient(2000) || getNutrient(1063)) * 10) / 10;
      const saturatedFat = Math.round(getNutrient(1258) * 10) / 10;

      // Build serving size string
      let servingSize = '';
      if (food.servingSize && food.servingSizeUnit) {
        servingSize = `${food.servingSize}${food.servingSizeUnit.toLowerCase()}`;
      }
      if (food.householdServingFullText) {
        servingSize = servingSize
          ? `${servingSize} (${food.householdServingFullText})`
          : food.householdServingFullText;
      }
      if (!servingSize) {
        servingSize = '100g';
      }

      return {
        name: food.description || 'Unknown Product',
        brand: food.brandOwner || food.brandName || '',
        calories,
        protein,
        carbs,
        fat,
        fiber,
        sodium,
        sugar,
        saturatedFat,
        servingSize,
        barcode: food.gtinUpc || '',
        source: 'usda',
      };
    }).filter(food => food.calories > 0);

  } catch (error) {
    console.error('Error searching USDA foods:', error);
    throw error;
  }
}

/**
 * Get food details by barcode (UPC/GTIN)
 * @param {string} barcode - UPC/GTIN barcode
 * @param {AbortSignal} signal - Optional abort signal
 * @returns {Promise<Object|null>} - Food object or null if not found
 */
export async function getFoodByBarcode(barcode, signal = null) {
  try {
    // Search by UPC in the branded foods database
    const url = `${API_BASE}/foods/search?api_key=${API_KEY}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: barcode,
        dataType: ['Branded'],
        pageSize: 5,
      }),
      signal,
    });

    if (!response.ok) {
      console.error('USDA barcode lookup failed:', response.status);
      return null;
    }

    const data = await response.json();

    if (!data || !data.foods || data.foods.length === 0) {
      return null;
    }

    // Find exact barcode match (USDA search is fuzzy, so we need to verify)
    const exactMatch = data.foods.find(food => food.gtinUpc === barcode);

    if (!exactMatch) {
      return null;
    }

    const food = exactMatch;
    const nutrients = food.foodNutrients || [];

    const getNutrient = (nutrientId) => {
      const nutrient = nutrients.find(n => n.nutrientId === nutrientId);
      return nutrient ? nutrient.value : 0;
    };

    const calories = Math.round(getNutrient(1008));
    const protein = Math.round(getNutrient(1003) * 10) / 10;
    const carbs = Math.round(getNutrient(1005) * 10) / 10;
    const fat = Math.round(getNutrient(1004) * 10) / 10;
    const fiber = Math.round(getNutrient(1079) * 10) / 10;
    const sodium = Math.round(getNutrient(1093));
    const sugar = Math.round((getNutrient(2000) || getNutrient(1063)) * 10) / 10;
    const saturatedFat = Math.round(getNutrient(1258) * 10) / 10;

    let servingSize = '';
    if (food.servingSize && food.servingSizeUnit) {
      servingSize = `${food.servingSize}${food.servingSizeUnit.toLowerCase()}`;
    }
    if (food.householdServingFullText) {
      servingSize = servingSize
        ? `${servingSize} (${food.householdServingFullText})`
        : food.householdServingFullText;
    }
    if (!servingSize) {
      servingSize = '100g';
    }

    return {
      name: food.description || 'Unknown Product',
      brand: food.brandOwner || food.brandName || '',
      calories,
      protein,
      carbs,
      fat,
      fiber,
      sodium,
      sugar,
      saturatedFat,
      servingSize,
      barcode: food.gtinUpc || '',
      source: 'usda',
    };

  } catch (error) {
    console.error('Error looking up barcode:', error);
    return null;
  }
}
