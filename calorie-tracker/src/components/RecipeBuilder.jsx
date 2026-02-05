import { useState, useEffect, useRef } from 'react';
import { commonFoods } from '../utils/commonFoods';
import { addCustomFood } from '../utils/storage';
import { getFoodByBarcode } from '../utils/openfoodfacts';
import BarcodeScanner from './BarcodeScanner';

export default function RecipeBuilder({ onSave, onClose }) {
  const [recipeName, setRecipeName] = useState('');
  const [servings, setServings] = useState(1);
  const [ingredients, setIngredients] = useState([]);
  const [showFoodSelector, setShowFoodSelector] = useState(false);
  const [showBarcodeScanner, setShowBarcodeScanner] = useState(false);
  const [showBarcodeManual, setShowBarcodeManual] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [barcodeInput, setBarcodeInput] = useState('');
  const [loadingBarcode, setLoadingBarcode] = useState(false);
  const modalRef = useRef(null);

  // Lock body scroll when modal opens
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  // Scroll to top when opening/closing selectors
  useEffect(() => {
    if (modalRef.current) {
      modalRef.current.scrollTop = 0;
    }
  }, [showFoodSelector, showBarcodeManual]);

  // Calculate total nutrition
  const calculateTotals = () => {
    const totals = ingredients.reduce((acc, ing) => {
      const multiplier = ing.quantity / 100; // Assuming base values are per 100g
      return {
        calories: acc.calories + (ing.calories * multiplier),
        protein: acc.protein + (ing.protein * multiplier),
        carbs: acc.carbs + (ing.carbs * multiplier),
        fat: acc.fat + (ing.fat * multiplier),
      };
    }, { calories: 0, protein: 0, carbs: 0, fat: 0 });

    // Divide by servings to get per-serving values
    return {
      calories: Math.round(totals.calories / servings),
      protein: Math.round(totals.protein / servings * 10) / 10,
      carbs: Math.round(totals.carbs / servings * 10) / 10,
      fat: Math.round(totals.fat / servings * 10) / 10,
    };
  };

  const addIngredient = (food, quantity = 100) => {
    setIngredients([...ingredients, {
      name: food.name,
      quantity: quantity,
      calories: food.calories || 0,
      protein: food.protein || 0,
      carbs: food.carbs || 0,
      fat: food.fat || 0,
    }]);
    setShowFoodSelector(false);
    setSearchQuery('');
  };

  const handleBarcodeSearch = async () => {
    if (!barcodeInput.trim()) return;

    setLoadingBarcode(true);
    const food = await getFoodByBarcode(barcodeInput.trim());

    if (food) {
      addIngredient(food, 100);
      setBarcodeInput('');
      setShowBarcodeManual(false);
    } else {
      alert('Product not found. Please try another barcode.');
    }
    setLoadingBarcode(false);
  };

  const removeIngredient = (index) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const updateIngredientQuantity = (index, quantity) => {
    const updated = [...ingredients];
    updated[index].quantity = parseFloat(quantity);
    setIngredients(updated);
  };

  const handleSaveRecipe = () => {
    if (!recipeName.trim()) {
      alert('Please enter a recipe name');
      return;
    }

    if (ingredients.length === 0) {
      alert('Please add at least one ingredient');
      return;
    }

    const totals = calculateTotals();

    const recipe = {
      name: recipeName,
      calories: totals.calories,
      protein: totals.protein,
      carbs: totals.carbs,
      fat: totals.fat,
      servingSize: `1 serving (${servings} servings total)`,
      isRecipe: true,
      ingredients: ingredients,
      totalServings: servings,
    };

    addCustomFood(recipe);
    onSave(recipe);
  };

  const filteredFoods = searchQuery.trim()
    ? commonFoods.filter(food =>
        food.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : commonFoods.slice(0, 50);

  const totals = calculateTotals();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center p-4 z-50 overflow-y-auto" ref={modalRef}>
      <div className="card max-w-4xl w-full my-8 max-h-[calc(100vh-4rem)] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Recipe Builder</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-3xl font-bold"
            aria-label="Close recipe builder"
          >
            ×
          </button>
        </div>

        {/* Recipe Name and Servings */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-semibold mb-2">Recipe Name *</label>
            <input
              type="text"
              value={recipeName}
              onChange={(e) => setRecipeName(e.target.value)}
              placeholder="e.g., Protein Smoothie"
              className="input-field"
              autoFocus
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="none"
              spellCheck="false"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Total Servings *</label>
            <input
              type="number"
              min="1"
              value={servings}
              onChange={(e) => setServings(parseInt(e.target.value) || 1)}
              className="input-field"
            />
          </div>
        </div>

        {/* Add Ingredient Buttons */}
        {!showFoodSelector && !showBarcodeScanner && !showBarcodeManual && (
          <div className="flex gap-3 mb-6">
            <button
              onClick={() => setShowFoodSelector(true)}
              className="btn-primary flex-1"
            >
              + Add from Common Foods
            </button>
            <button
              onClick={() => setShowBarcodeScanner(true)}
              className="btn-secondary flex-1"
            >
              📷 Scan Barcode
            </button>
          </div>
        )}

        {/* Food Selector */}
        {showFoodSelector && (
          <div className="mb-6 border-2 border-emerald-500 rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold">Select Ingredient</h3>
              <button
                onClick={() => {
                  setShowFoodSelector(false);
                  setSearchQuery('');
                }}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                aria-label="Close food selector"
              >
                ×
              </button>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search foods..."
              className="input-field mb-4"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="none"
              spellCheck="false"
            />
            <div className="max-h-64 overflow-y-auto space-y-2">
              {filteredFoods.map((food, index) => (
                <button
                  key={index}
                  onClick={() => addIngredient(food)}
                  className="w-full text-left p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <div className="font-semibold">{food.name}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {food.calories} cal • P: {food.protein}g • C: {food.carbs}g • F: {food.fat}g
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Barcode Scanner */}
        {showBarcodeScanner && (
          <BarcodeScanner
            onAddFood={(food) => {
              addIngredient(food, 100);
              setShowBarcodeScanner(false);
            }}
            onClose={() => setShowBarcodeScanner(false)}
          />
        )}

        {/* Manual Barcode Input */}
        {showBarcodeManual && (
          <div className="mb-6 border-2 border-emerald-500 rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold">Enter Barcode Manually</h3>
              <button
                onClick={() => {
                  setShowBarcodeManual(false);
                  setBarcodeInput('');
                }}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                aria-label="Close barcode entry"
              >
                ×
              </button>
            </div>
            <input
              type="text"
              value={barcodeInput}
              onChange={(e) => setBarcodeInput(e.target.value)}
              placeholder="Enter barcode number"
              className="input-field mb-4"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="none"
              spellCheck="false"
            />
            <button
              onClick={handleBarcodeSearch}
              disabled={loadingBarcode}
              className="btn-primary w-full"
            >
              {loadingBarcode ? 'Searching...' : 'Look Up'}
            </button>
          </div>
        )}

        {/* Ingredients List */}
        {ingredients.length > 0 && (
          <div className="mb-6">
            <h3 className="font-bold mb-3">Ingredients ({ingredients.length})</h3>
            <div className="space-y-3">
              {ingredients.map((ing, index) => (
                <div
                  key={index}
                  className="border-2 border-gray-200 dark:border-gray-700 rounded-lg p-3"
                >
                  <div className="flex justify-between items-start gap-3">
                    <div className="flex-1">
                      <div className="font-semibold">{ing.name}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {Math.round(ing.calories * ing.quantity / 100)} cal •
                        P: {Math.round(ing.protein * ing.quantity / 100 * 10) / 10}g •
                        C: {Math.round(ing.carbs * ing.quantity / 100 * 10) / 10}g •
                        F: {Math.round(ing.fat * ing.quantity / 100 * 10) / 10}g
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <label htmlFor={`quantity-${index}`} className="sr-only">
                        Quantity in grams for {ing.name}
                      </label>
                      <input
                        id={`quantity-${index}`}
                        type="number"
                        min="1"
                        step="1"
                        value={ing.quantity}
                        onChange={(e) => updateIngredientQuantity(index, e.target.value)}
                        className="input-field w-20 text-sm"
                      />
                      <span className="text-sm text-gray-600 dark:text-gray-400">g</span>
                      <button
                        onClick={() => removeIngredient(index)}
                        className="text-red-600 hover:text-red-700 dark:text-red-400 text-xl font-bold"
                        aria-label="Remove ingredient"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Nutrition Summary */}
        {ingredients.length > 0 && (
          <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-4 mb-6">
            <h3 className="font-bold mb-2">Per Serving ({servings} servings total)</h3>
            <div className="grid grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  {totals.calories}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Calories</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  {totals.protein}g
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Protein</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  {totals.carbs}g
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Carbs</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  {totals.fat}g
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Fat</div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button onClick={onClose} className="btn-secondary flex-1">
            Cancel
          </button>
          <button
            onClick={handleSaveRecipe}
            className="btn-primary flex-1"
            disabled={!recipeName.trim() || ingredients.length === 0}
          >
            Save Recipe
          </button>
        </div>
      </div>
    </div>
  );
}
