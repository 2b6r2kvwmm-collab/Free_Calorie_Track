// Unified food API that tries USDA first, then falls back to Open Food Facts
// This provides the best of both worlds: USDA reliability for US foods,
// Open Food Facts coverage for international products

import * as usda from './usda';
import * as openfoodfacts from './openfoodfacts';

/**
 * Search for foods using USDA API first, then fall back to Open Food Facts
 * @param {string} query - Search term
 * @param {AbortSignal} signal - Optional abort signal for cancellation
 * @returns {Promise<Array>} - Array of food objects
 */
export async function searchFoods(query, signal = null) {
  let usdaError = null;

  // Try USDA first
  try {
    const usdaResults = await usda.searchFoods(query, signal);

    if (usdaResults && usdaResults.length > 0) {
      return usdaResults;
    }
  } catch (error) {
    if (error.name === 'AbortError') {
      throw error; // Don't catch abort errors, let them propagate
    }

    usdaError = error;
  }

  // Fall back to Open Food Facts
  try {
    const offResults = await openfoodfacts.searchFoods(query, signal);

    if (offResults && offResults.length > 0) {
      return offResults;
    }

    return [];
  } catch (error) {
    if (error.name === 'AbortError') {
      throw error;
    }

    // If both failed, throw a combined error
    if (usdaError) {
      throw new Error(`Both APIs failed. USDA: ${usdaError.message} | Open Food Facts: ${error.message}`);
    }

    throw error;
  }
}

/**
 * Get food by barcode using USDA first, then fall back to Open Food Facts
 * @param {string} barcode - UPC/GTIN barcode
 * @param {AbortSignal} signal - Optional abort signal
 * @returns {Promise<Object|null>} - Food object or null if not found
 */
export async function getFoodByBarcode(barcode, signal = null) {
  // Try USDA first
  try {
    const usdaResult = await usda.getFoodByBarcode(barcode, signal);

    if (usdaResult) {
      return usdaResult;
    }
  } catch (error) {
    if (error.name === 'AbortError') {
      throw error;
    }
  }

  // Fall back to Open Food Facts
  try {
    const offResult = await openfoodfacts.getFoodByBarcode(barcode, signal);

    if (offResult) {
      return offResult;
    }

    return null;
  } catch (error) {
    if (error.name === 'AbortError') {
      throw error;
    }

    return null;
  }
}
