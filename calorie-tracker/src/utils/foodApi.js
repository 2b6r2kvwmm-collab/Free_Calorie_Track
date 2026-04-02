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
    console.log('🇺🇸 Trying USDA API first...');
    const usdaResults = await usda.searchFoods(query, signal);

    if (usdaResults && usdaResults.length > 0) {
      console.log(`✅ USDA returned ${usdaResults.length} results`);
      return usdaResults;
    }

    console.log('⚠️ USDA returned no results, trying Open Food Facts...');
  } catch (error) {
    if (error.name === 'AbortError') {
      throw error; // Don't catch abort errors, let them propagate
    }

    console.log('❌ USDA API failed:', error.message);
    usdaError = error;
  }

  // Fall back to Open Food Facts
  try {
    console.log('🌍 Trying Open Food Facts as fallback...');
    const offResults = await openfoodfacts.searchFoods(query, signal);

    if (offResults && offResults.length > 0) {
      console.log(`✅ Open Food Facts returned ${offResults.length} results`);
      return offResults;
    }

    console.log('⚠️ Open Food Facts also returned no results');
    return [];
  } catch (error) {
    if (error.name === 'AbortError') {
      throw error;
    }

    console.log('❌ Open Food Facts also failed:', error.message);

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
    console.log('🇺🇸 Looking up barcode in USDA database...');
    const usdaResult = await usda.getFoodByBarcode(barcode, signal);

    if (usdaResult) {
      console.log('✅ Found in USDA database');
      return usdaResult;
    }

    console.log('⚠️ Not found in USDA, trying Open Food Facts...');
  } catch (error) {
    if (error.name === 'AbortError') {
      throw error;
    }

    console.log('❌ USDA barcode lookup failed:', error.message);
  }

  // Fall back to Open Food Facts
  try {
    console.log('🌍 Looking up barcode in Open Food Facts...');
    const offResult = await openfoodfacts.getFoodByBarcode(barcode, signal);

    if (offResult) {
      console.log('✅ Found in Open Food Facts database');
      return offResult;
    }

    console.log('⚠️ Barcode not found in either database');
    return null;
  } catch (error) {
    if (error.name === 'AbortError') {
      throw error;
    }

    console.log('❌ Open Food Facts barcode lookup also failed:', error.message);
    return null;
  }
}
