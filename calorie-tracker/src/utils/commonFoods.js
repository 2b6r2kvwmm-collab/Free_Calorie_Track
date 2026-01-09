// Common generic foods for home cooking
// Calories and macros are per serving size specified
// Macros: protein, carbs, fat (in grams)

export const commonFoods = [
  // Proteins - Meat & Poultry (cooked only)
  { name: 'Chicken Breast (cooked)', calories: 195, protein: 35, carbs: 0, fat: 5, servingSize: '100g', category: 'Protein' },
  { name: 'Chicken Thigh (cooked)', calories: 247, protein: 28, carbs: 0, fat: 14, servingSize: '100g', category: 'Protein' },
  { name: 'Ground Beef (cooked)', calories: 250, protein: 26, carbs: 0, fat: 15, servingSize: '100g', category: 'Protein' },
  { name: 'Steak (cooked)', calories: 250, protein: 26, carbs: 0, fat: 15, servingSize: '100g', category: 'Protein' },
  { name: 'Pork Chop (cooked)', calories: 242, protein: 28, carbs: 0, fat: 14, servingSize: '100g', category: 'Protein' },
  { name: 'Bacon (cooked)', calories: 541, protein: 37, carbs: 1, fat: 42, servingSize: '100g', category: 'Protein' },
  { name: 'Turkey Breast (cooked)', calories: 189, protein: 29, carbs: 0, fat: 7, servingSize: '100g', category: 'Protein' },

  // Proteins - Fish & Seafood (raw for sushi/sashimi, cooked for others)
  { name: 'Salmon (raw, sushi/sashimi)', calories: 208, protein: 20, carbs: 0, fat: 13, servingSize: '100g', category: 'Protein' },
  { name: 'Salmon (cooked)', calories: 206, protein: 22, carbs: 0, fat: 12, servingSize: '100g', category: 'Protein' },
  { name: 'Smoked Salmon (lox)', calories: 117, protein: 18, carbs: 0, fat: 4.3, servingSize: '100g (3.5 oz)', category: 'Protein' },
  { name: 'Tuna (raw, sushi/sashimi)', calories: 144, protein: 23, carbs: 0, fat: 5, servingSize: '100g', category: 'Protein' },
  { name: 'Tuna (canned in water)', calories: 116, protein: 26, carbs: 0, fat: 1, servingSize: '100g', category: 'Protein' },
  { name: 'Tilapia (cooked)', calories: 128, protein: 26, carbs: 0, fat: 2.7, servingSize: '100g', category: 'Protein' },
  { name: 'Shrimp (cooked)', calories: 99, protein: 24, carbs: 0, fat: 0.3, servingSize: '100g', category: 'Protein' },
  { name: 'Cod (cooked)', calories: 105, protein: 23, carbs: 0, fat: 0.9, servingSize: '100g', category: 'Protein' },

  // Proteins - Eggs & Dairy
  { name: 'Egg (1 large)', calories: 72, protein: 6, carbs: 0.4, fat: 5, servingSize: '1 egg (50g)', category: 'Protein' },
  { name: 'Egg White (1 large)', calories: 17, protein: 3.6, carbs: 0.2, fat: 0, servingSize: '1 egg white', category: 'Protein' },
  { name: 'Greek Yogurt (nonfat)', calories: 59, protein: 10, carbs: 3.6, fat: 0.4, servingSize: '100g', category: 'Protein' },
  { name: 'Greek Yogurt (full fat)', calories: 97, protein: 9, carbs: 3.6, fat: 5, servingSize: '100g', category: 'Protein' },
  { name: 'Cottage Cheese (lowfat)', calories: 72, protein: 12, carbs: 3, fat: 1, servingSize: '100g', category: 'Protein' },
  { name: 'Milk (whole)', calories: 61, protein: 3.2, carbs: 4.8, fat: 3.3, servingSize: '100ml', category: 'Drinks' },
  { name: 'Milk (2%)', calories: 50, protein: 3.3, carbs: 4.8, fat: 2, servingSize: '100ml', category: 'Drinks' },
  { name: 'Milk (skim)', calories: 34, protein: 3.4, carbs: 5, fat: 0.2, servingSize: '100ml', category: 'Drinks' },
  { name: 'Cheddar Cheese', calories: 403, protein: 25, carbs: 1.3, fat: 33, servingSize: '100g', category: 'Protein' },
  { name: 'Cheddar Cheese (1 slice)', calories: 113, protein: 7, carbs: 0.4, fat: 9.3, servingSize: '1 slice (28g)', category: 'Protein' },
  { name: 'American Cheese (1 slice)', calories: 96, protein: 5, carbs: 2, fat: 7, servingSize: '1 slice (21g)', category: 'Protein' },
  { name: 'Swiss Cheese (1 slice)', calories: 106, protein: 8, carbs: 1.5, fat: 8, servingSize: '1 slice (28g)', category: 'Protein' },
  { name: 'Provolone Cheese (1 slice)', calories: 98, protein: 7, carbs: 0.6, fat: 7.5, servingSize: '1 slice (28g)', category: 'Protein' },
  { name: 'Pepper Jack Cheese (1 slice)', calories: 110, protein: 6.5, carbs: 0.5, fat: 9, servingSize: '1 slice (28g)', category: 'Protein' },
  { name: 'Mozzarella Cheese', calories: 280, protein: 28, carbs: 2.2, fat: 17, servingSize: '100g', category: 'Protein' },
  { name: 'Cream Cheese (2 tbsp)', calories: 100, protein: 2, carbs: 2, fat: 10, servingSize: '2 tbsp (30g)', category: 'Protein' },
  { name: 'Cream Cheese (light, 2 tbsp)', calories: 70, protein: 3, carbs: 2, fat: 5, servingSize: '2 tbsp (30g)', category: 'Protein' },

  // Proteins - Plant-based
  { name: 'Tofu (firm)', calories: 144, protein: 17, carbs: 3, fat: 9, servingSize: '100g', category: 'Protein' },
  { name: 'Black Beans (cooked)', calories: 132, protein: 9, carbs: 24, fat: 0.5, servingSize: '100g', category: 'Protein' },
  { name: 'Chickpeas (cooked)', calories: 164, protein: 9, carbs: 27, fat: 2.6, servingSize: '100g', category: 'Protein' },
  { name: 'Lentils (cooked)', calories: 116, protein: 9, carbs: 20, fat: 0.4, servingSize: '100g', category: 'Protein' },
  { name: 'Peanut Butter (2 tbsp)', calories: 188, protein: 8, carbs: 6, fat: 16, servingSize: '2 tbsp (32g)', category: 'Protein' },
  { name: 'Peanut Butter (1 tbsp)', calories: 94, protein: 4, carbs: 3, fat: 8, servingSize: '1 tbsp (16g)', category: 'Protein' },
  { name: 'Almonds (1 oz, ~23 nuts)', calories: 164, protein: 6, carbs: 6, fat: 14, servingSize: '1 oz / 23 almonds (28g)', category: 'Protein' },
  { name: 'Almonds (1/4 cup)', calories: 207, protein: 8, carbs: 8, fat: 18, servingSize: '1/4 cup (36g)', category: 'Protein' },
  { name: 'Walnuts (1 oz, ~14 halves)', calories: 185, protein: 4, carbs: 4, fat: 18, servingSize: '1 oz / 14 halves (28g)', category: 'Protein' },
  { name: 'Walnuts (1/4 cup)', calories: 196, protein: 5, carbs: 4, fat: 20, servingSize: '1/4 cup (30g)', category: 'Protein' },

  // Carbohydrates - Grains
  { name: 'White Rice (cooked)', calories: 130, protein: 2.7, carbs: 28, fat: 0.3, servingSize: '100g', category: 'Carbs' },
  { name: 'Brown Rice (cooked)', calories: 112, protein: 2.6, carbs: 24, fat: 0.9, servingSize: '100g', category: 'Carbs' },
  { name: 'Quinoa (cooked)', calories: 120, protein: 4.4, carbs: 21, fat: 1.9, servingSize: '100g', category: 'Carbs' },
  { name: 'Pasta (cooked)', calories: 131, protein: 5, carbs: 25, fat: 1.1, servingSize: '100g', category: 'Carbs' },
  { name: 'Whole Wheat Pasta (cooked)', calories: 124, protein: 5, carbs: 26, fat: 0.5, servingSize: '100g', category: 'Carbs' },
  { name: 'Oatmeal (cooked)', calories: 71, protein: 2.5, carbs: 12, fat: 1.5, servingSize: '100g', category: 'Carbs' },
  { name: 'White Bread (1 slice)', calories: 79, protein: 2.7, carbs: 15, fat: 1, servingSize: '1 slice (30g)', category: 'Carbs' },
  { name: 'Whole Wheat Bread (1 slice)', calories: 81, protein: 4, carbs: 14, fat: 1.1, servingSize: '1 slice (30g)', category: 'Carbs' },
  { name: 'Sourdough Bread (1 slice)', calories: 88, protein: 3.5, carbs: 17, fat: 0.5, servingSize: '1 slice (32g)', category: 'Carbs' },
  { name: 'Rye Bread (1 slice)', calories: 83, protein: 2.7, carbs: 15.5, fat: 1.1, servingSize: '1 slice (32g)', category: 'Carbs' },
  { name: 'Multigrain Bread (1 slice)', calories: 85, protein: 4, carbs: 15, fat: 1.5, servingSize: '1 slice (32g)', category: 'Carbs' },
  { name: 'Ciabatta Roll (1 roll)', calories: 170, protein: 6, carbs: 34, fat: 1, servingSize: '1 roll (60g)', category: 'Carbs' },
  { name: 'Hoagie/Sub Roll (6 inch)', calories: 200, protein: 7, carbs: 40, fat: 2, servingSize: '1 roll (70g)', category: 'Carbs' },
  { name: 'Tortilla (flour, 1 medium)', calories: 159, protein: 4, carbs: 26, fat: 4, servingSize: '1 tortilla (49g)', category: 'Carbs' },
  { name: 'Bagel (plain)', calories: 277, protein: 11, carbs: 55, fat: 1.7, servingSize: '1 bagel (95g)', category: 'Carbs' },
  { name: 'Bagel (everything)', calories: 289, protein: 11, carbs: 56, fat: 2.2, servingSize: '1 bagel (98g)', category: 'Carbs' },
  { name: 'Bagel (sesame)', calories: 280, protein: 11, carbs: 55, fat: 2, servingSize: '1 bagel (95g)', category: 'Carbs' },
  { name: 'Bagel (whole wheat)', calories: 260, protein: 10, carbs: 54, fat: 1.5, servingSize: '1 bagel (95g)', category: 'Carbs' },
  { name: 'Bagel (cinnamon raisin)', calories: 290, protein: 10, carbs: 59, fat: 1.8, servingSize: '1 bagel (95g)', category: 'Carbs' },
  { name: 'Bagel (blueberry)', calories: 290, protein: 9, carbs: 58, fat: 2, servingSize: '1 bagel (95g)', category: 'Carbs' },
  { name: 'English Muffin', calories: 134, protein: 5, carbs: 26, fat: 1, servingSize: '1 muffin (57g)', category: 'Carbs' },

  // Breakfast Foods - Cereals & Grains
  { name: 'Cheerios (1 cup)', calories: 100, protein: 3, carbs: 20, fat: 2, servingSize: '1 cup (28g)', category: 'Breakfast' },
  { name: 'Frosted Flakes (3/4 cup)', calories: 110, protein: 1, carbs: 27, fat: 0, servingSize: '3/4 cup (30g)', category: 'Breakfast' },
  { name: 'Corn Flakes (1 cup)', calories: 100, protein: 2, carbs: 24, fat: 0, servingSize: '1 cup (28g)', category: 'Breakfast' },
  { name: 'Raisin Bran (1 cup)', calories: 190, protein: 5, carbs: 46, fat: 1.5, servingSize: '1 cup (59g)', category: 'Breakfast' },
  { name: 'Special K (1 cup)', calories: 120, protein: 7, carbs: 23, fat: 0.5, servingSize: '1 cup (31g)', category: 'Breakfast' },
  { name: 'Granola (1/2 cup)', calories: 220, protein: 5, carbs: 38, fat: 6, servingSize: '1/2 cup (55g)', category: 'Breakfast' },
  { name: 'Oatmeal (instant, 1 packet)', calories: 130, protein: 4, carbs: 27, fat: 2, servingSize: '1 packet (43g)', category: 'Breakfast' },
  { name: 'Cream of Wheat (cooked, 1 cup)', calories: 133, protein: 4, carbs: 28, fat: 0.5, servingSize: '1 cup', category: 'Breakfast' },
  { name: 'Grits (cooked, 1 cup)', calories: 140, protein: 3, carbs: 31, fat: 1, servingSize: '1 cup', category: 'Breakfast' },

  // Breakfast Foods - Meats
  { name: 'Bacon (2 slices)', calories: 90, protein: 6, carbs: 0, fat: 7, servingSize: '2 slices (16g)', category: 'Breakfast' },
  { name: 'Turkey Bacon (2 slices)', calories: 70, protein: 6, carbs: 0, fat: 5, servingSize: '2 slices (30g)', category: 'Breakfast' },
  { name: 'Breakfast Sausage (2 links)', calories: 180, protein: 8, carbs: 1, fat: 16, servingSize: '2 links (56g)', category: 'Breakfast' },
  { name: 'Breakfast Sausage Patty (1 patty)', calories: 100, protein: 5, carbs: 0.5, fat: 8, servingSize: '1 patty (38g)', category: 'Breakfast' },
  { name: 'Turkey Sausage (2 links)', calories: 130, protein: 10, carbs: 2, fat: 9, servingSize: '2 links (56g)', category: 'Breakfast' },
  { name: 'Ham Slice (1 slice)', calories: 60, protein: 10, carbs: 1, fat: 2, servingSize: '1 slice (57g)', category: 'Breakfast' },
  { name: 'Canadian Bacon (2 slices)', calories: 90, protein: 12, carbs: 1, fat: 4, servingSize: '2 slices (56g)', category: 'Breakfast' },

  // Breakfast Foods - Eggs & Dishes
  { name: 'Scrambled Eggs (2 eggs)', calories: 180, protein: 13, carbs: 2, fat: 14, servingSize: '2 eggs', category: 'Breakfast' },
  { name: 'Omelet (cheese, 3 eggs)', calories: 380, protein: 28, carbs: 3, fat: 29, servingSize: '1 omelet', category: 'Breakfast' },
  { name: 'Omelet (veggie, 3 eggs)', calories: 280, protein: 22, carbs: 8, fat: 18, servingSize: '1 omelet', category: 'Breakfast' },
  { name: 'Eggs Benedict (1 serving)', calories: 440, protein: 22, carbs: 32, fat: 25, servingSize: '1 serving', category: 'Breakfast' },
  { name: 'Breakfast Burrito', calories: 380, protein: 18, carbs: 38, fat: 16, servingSize: '1 burrito', category: 'Breakfast' },
  { name: 'Quiche (1 slice)', calories: 350, protein: 14, carbs: 20, fat: 24, servingSize: '1 slice', category: 'Breakfast' },

  // Breakfast Foods - Pancakes & Waffles
  { name: 'Pancakes (3, plain)', calories: 340, protein: 10, carbs: 52, fat: 10, servingSize: '3 pancakes', category: 'Breakfast' },
  { name: 'Pancakes (3, with butter & syrup)', calories: 520, protein: 10, carbs: 90, fat: 14, servingSize: '3 pancakes', category: 'Breakfast' },
  { name: 'Blueberry Pancakes (3)', calories: 380, protein: 10, carbs: 58, fat: 12, servingSize: '3 pancakes', category: 'Breakfast' },
  { name: 'Waffles (2, plain)', calories: 280, protein: 8, carbs: 42, fat: 10, servingSize: '2 waffles', category: 'Breakfast' },
  { name: 'Waffles (2, with butter & syrup)', calories: 460, protein: 8, carbs: 80, fat: 14, servingSize: '2 waffles', category: 'Breakfast' },
  { name: 'Belgian Waffle (1)', calories: 220, protein: 6, carbs: 33, fat: 7, servingSize: '1 waffle', category: 'Breakfast' },
  { name: 'French Toast (2 slices)', calories: 360, protein: 12, carbs: 48, fat: 14, servingSize: '2 slices', category: 'Breakfast' },
  { name: 'Crepes (2, plain)', calories: 220, protein: 8, carbs: 28, fat: 8, servingSize: '2 crepes', category: 'Breakfast' },

  // Breakfast Foods - Muffins & Pastries
  { name: 'Blueberry Muffin', calories: 360, protein: 6, carbs: 54, fat: 14, servingSize: '1 muffin (113g)', category: 'Breakfast' },
  { name: 'Bran Muffin', calories: 305, protein: 7, carbs: 55, fat: 8, servingSize: '1 muffin (113g)', category: 'Breakfast' },
  { name: 'Corn Muffin', calories: 345, protein: 6, carbs: 58, fat: 11, servingSize: '1 muffin (113g)', category: 'Breakfast' },
  { name: 'Banana Nut Muffin', calories: 380, protein: 7, carbs: 56, fat: 15, servingSize: '1 muffin (113g)', category: 'Breakfast' },
  { name: 'Scone (plain)', calories: 330, protein: 5, carbs: 48, fat: 13, servingSize: '1 scone (90g)', category: 'Breakfast' },
  { name: 'Scone (blueberry)', calories: 360, protein: 5, carbs: 52, fat: 14, servingSize: '1 scone (95g)', category: 'Breakfast' },
  { name: 'Croissant', calories: 231, protein: 5, carbs: 26, fat: 12, servingSize: '1 croissant (50g)', category: 'Breakfast' },
  { name: 'Pain au Chocolat', calories: 280, protein: 5, carbs: 33, fat: 14, servingSize: '1 pastry', category: 'Breakfast' },
  { name: 'Cinnamon Roll', calories: 420, protein: 7, carbs: 58, fat: 18, servingSize: '1 roll', category: 'Breakfast' },
  { name: 'Danish Pastry', calories: 340, protein: 5, carbs: 42, fat: 17, servingSize: '1 pastry', category: 'Breakfast' },
  { name: 'Pop-Tart (1 pastry)', calories: 200, protein: 2, carbs: 37, fat: 5, servingSize: '1 pastry', category: 'Breakfast' },

  // Breakfast Foods - Potatoes
  { name: 'Hash Browns (1/2 cup)', calories: 170, protein: 2, carbs: 22, fat: 9, servingSize: '1/2 cup', category: 'Breakfast' },
  { name: 'Home Fries (1 cup)', calories: 240, protein: 3, carbs: 32, fat: 12, servingSize: '1 cup', category: 'Breakfast' },
  { name: 'Tater Tots (10 pieces)', calories: 160, protein: 2, carbs: 20, fat: 8, servingSize: '10 pieces', category: 'Breakfast' },

  // Breakfast Foods - Yogurt & Fruit
  { name: 'Yogurt Parfait (with granola)', calories: 280, protein: 12, carbs: 48, fat: 6, servingSize: '1 parfait', category: 'Breakfast' },
  { name: 'Fruit Salad (1 cup)', calories: 90, protein: 1, carbs: 23, fat: 0.5, servingSize: '1 cup', category: 'Breakfast' },
  { name: 'Fruit & Yogurt Bowl', calories: 220, protein: 10, carbs: 42, fat: 3, servingSize: '1 bowl', category: 'Breakfast' },

  // Breakfast Foods - Toppings & Spreads
  { name: 'Maple Syrup (1/4 cup)', calories: 210, protein: 0, carbs: 53, fat: 0, servingSize: '1/4 cup (60ml)', category: 'Breakfast' },
  { name: 'Butter (1 tbsp)', calories: 102, protein: 0.1, carbs: 0, fat: 11.5, servingSize: '1 tbsp (14g)', category: 'Breakfast' },
  { name: 'Jam/Jelly (1 tbsp)', calories: 56, protein: 0, carbs: 14, fat: 0, servingSize: '1 tbsp', category: 'Breakfast' },
  { name: 'Honey (1 tbsp)', calories: 64, protein: 0.1, carbs: 17, fat: 0, servingSize: '1 tbsp', category: 'Breakfast' },
  { name: 'Nutella (1 tbsp)', calories: 100, protein: 1, carbs: 11, fat: 6, servingSize: '1 tbsp', category: 'Breakfast' },

  // Carbohydrates - Potatoes & Starchy Vegetables
  { name: 'Potato (baked with skin)', calories: 93, protein: 2.5, carbs: 21, fat: 0.1, servingSize: '100g', category: 'Carbs' },
  { name: 'Sweet Potato (baked)', calories: 90, protein: 2, carbs: 21, fat: 0.2, servingSize: '100g', category: 'Carbs' },
  { name: 'Corn (cooked)', calories: 96, protein: 3.4, carbs: 21, fat: 1.5, servingSize: '100g', category: 'Carbs' },

  // Fruits
  { name: 'Apple (1 medium)', calories: 95, protein: 0.5, carbs: 25, fat: 0.3, servingSize: '1 apple (182g)', category: 'Fruits' },
  { name: 'Banana (1 medium)', calories: 105, protein: 1.3, carbs: 27, fat: 0.4, servingSize: '1 banana (118g)', category: 'Fruits' },
  { name: 'Orange (1 medium)', calories: 62, protein: 1.2, carbs: 15, fat: 0.2, servingSize: '1 orange (131g)', category: 'Fruits' },
  { name: 'Strawberries', calories: 32, protein: 0.7, carbs: 7.7, fat: 0.3, servingSize: '100g', category: 'Fruits' },
  { name: 'Blueberries', calories: 57, protein: 0.7, carbs: 14, fat: 0.3, servingSize: '100g', category: 'Fruits' },
  { name: 'Grapes', calories: 69, protein: 0.7, carbs: 18, fat: 0.2, servingSize: '100g', category: 'Fruits' },
  { name: 'Watermelon', calories: 30, protein: 0.6, carbs: 7.6, fat: 0.2, servingSize: '100g', category: 'Fruits' },
  { name: 'Avocado (1/2 medium)', calories: 161, protein: 2, carbs: 8.6, fat: 15, servingSize: '1/2 avocado (100g)', category: 'Fruits' },

  // Vegetables - Non-starchy
  { name: 'Broccoli (cooked)', calories: 35, protein: 2.4, carbs: 7, fat: 0.4, servingSize: '100g', category: 'Vegetables' },
  { name: 'Spinach (raw)', calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4, servingSize: '100g', category: 'Vegetables' },
  { name: 'Spinach (cooked)', calories: 23, protein: 3, carbs: 3.8, fat: 0.3, servingSize: '100g', category: 'Vegetables' },
  { name: 'Carrots (raw)', calories: 41, protein: 0.9, carbs: 10, fat: 0.2, servingSize: '100g', category: 'Vegetables' },
  { name: 'Bell Pepper (raw)', calories: 31, protein: 1, carbs: 6, fat: 0.3, servingSize: '100g', category: 'Vegetables' },
  { name: 'Tomato (1 medium)', calories: 22, protein: 1.1, carbs: 4.8, fat: 0.2, servingSize: '1 tomato (123g)', category: 'Vegetables' },
  { name: 'Cucumber', calories: 16, protein: 0.7, carbs: 3.6, fat: 0.1, servingSize: '100g', category: 'Vegetables' },
  { name: 'Lettuce (romaine)', calories: 17, protein: 1.2, carbs: 3.3, fat: 0.3, servingSize: '100g', category: 'Vegetables' },
  { name: 'Lettuce (1 leaf)', calories: 3, protein: 0.2, carbs: 0.6, fat: 0, servingSize: '1 large leaf (17g)', category: 'Vegetables' },
  { name: 'Tomato (1 slice)', calories: 4, protein: 0.2, carbs: 0.9, fat: 0, servingSize: '1 slice (20g)', category: 'Vegetables' },
  { name: 'Onion (raw)', calories: 40, protein: 1.1, carbs: 9.3, fat: 0.1, servingSize: '100g', category: 'Vegetables' },
  { name: 'Onion (1 slice)', calories: 5, protein: 0.1, carbs: 1.2, fat: 0, servingSize: '1 slice (13g)', category: 'Vegetables' },
  { name: 'Pickles (dill, 3 slices)', calories: 5, protein: 0.2, carbs: 1, fat: 0, servingSize: '3 slices (30g)', category: 'Vegetables' },
  { name: 'Pickles (sweet, 3 slices)', calories: 30, protein: 0.1, carbs: 8, fat: 0, servingSize: '3 slices (30g)', category: 'Vegetables' },
  { name: 'Jalapeños (sliced, 2 tbsp)', calories: 4, protein: 0.1, carbs: 1, fat: 0, servingSize: '2 tbsp (14g)', category: 'Vegetables' },
  { name: 'Mushrooms (raw)', calories: 22, protein: 3.1, carbs: 3.3, fat: 0.3, servingSize: '100g', category: 'Vegetables' },
  { name: 'Zucchini (raw)', calories: 17, protein: 1.2, carbs: 3.1, fat: 0.3, servingSize: '100g', category: 'Vegetables' },
  { name: 'Green Beans (cooked)', calories: 31, protein: 1.8, carbs: 7, fat: 0.2, servingSize: '100g', category: 'Vegetables' },

  // Fats & Oils
  { name: 'Olive Oil (1 tbsp)', calories: 119, protein: 0, carbs: 0, fat: 13.5, servingSize: '1 tbsp (13.5g)', category: 'Fats' },
  { name: 'Butter (1 tbsp)', calories: 102, protein: 0.1, carbs: 0, fat: 11.5, servingSize: '1 tbsp (14g)', category: 'Fats' },
  { name: 'Coconut Oil (1 tbsp)', calories: 121, protein: 0, carbs: 0, fat: 13.6, servingSize: '1 tbsp (13.6g)', category: 'Fats' },

  // Condiments
  { name: 'Mayonnaise (1 tbsp)', calories: 94, protein: 0.1, carbs: 0.1, fat: 10.3, servingSize: '1 tbsp (14g)', category: 'Fats' },
  { name: 'Mayo (light, 1 tbsp)', calories: 35, protein: 0, carbs: 1, fat: 3.5, servingSize: '1 tbsp (15g)', category: 'Fats' },
  { name: 'Mustard (yellow, 1 tsp)', calories: 3, protein: 0.2, carbs: 0.3, fat: 0.2, servingSize: '1 tsp (5g)', category: 'Fats' },
  { name: 'Mustard (dijon, 1 tsp)', calories: 5, protein: 0.3, carbs: 0.5, fat: 0.3, servingSize: '1 tsp (5g)', category: 'Fats' },
  { name: 'Ketchup (1 tbsp)', calories: 17, protein: 0.2, carbs: 4.5, fat: 0, servingSize: '1 tbsp (17g)', category: 'Fats' },
  { name: 'BBQ Sauce (1 tbsp)', calories: 29, protein: 0.2, carbs: 7, fat: 0.1, servingSize: '1 tbsp (18g)', category: 'Fats' },
  { name: 'Hot Sauce (1 tsp)', calories: 1, protein: 0, carbs: 0.1, fat: 0, servingSize: '1 tsp (5ml)', category: 'Fats' },
  { name: 'Ranch Dressing (1 tbsp)', calories: 73, protein: 0.4, carbs: 1, fat: 7.7, servingSize: '1 tbsp (15g)', category: 'Fats' },
  { name: 'Italian Dressing (1 tbsp)', calories: 43, protein: 0, carbs: 1.5, fat: 4.2, servingSize: '1 tbsp (15g)', category: 'Fats' },
  { name: 'Vinaigrette (1 tbsp)', calories: 50, protein: 0, carbs: 2, fat: 5, servingSize: '1 tbsp (15g)', category: 'Fats' },
  { name: 'Honey Mustard (1 tbsp)', calories: 30, protein: 0, carbs: 7, fat: 0.5, servingSize: '1 tbsp (15g)', category: 'Fats' },
  { name: 'Chipotle Mayo (1 tbsp)', calories: 90, protein: 0, carbs: 1, fat: 10, servingSize: '1 tbsp (14g)', category: 'Fats' },
  { name: 'Sriracha (1 tsp)', calories: 5, protein: 0.1, carbs: 1, fat: 0, servingSize: '1 tsp (5ml)', category: 'Fats' },

  // Drinks - Coffee & Espresso
  { name: 'Coffee (black)', calories: 2, protein: 0.3, carbs: 0, fat: 0, servingSize: '8 oz (240ml)', category: 'Drinks' },
  { name: 'Espresso (single shot)', calories: 3, protein: 0.2, carbs: 0.5, fat: 0, servingSize: '1 oz (30ml)', category: 'Drinks' },
  { name: 'Latte (whole milk)', calories: 150, protein: 8, carbs: 14, fat: 6, servingSize: '12 oz', category: 'Drinks' },
  { name: 'Latte (skim milk)', calories: 100, protein: 10, carbs: 15, fat: 0.5, servingSize: '12 oz', category: 'Drinks' },
  { name: 'Cappuccino (whole milk)', calories: 120, protein: 6, carbs: 10, fat: 6, servingSize: '12 oz', category: 'Drinks' },
  { name: 'Cappuccino (skim milk)', calories: 80, protein: 8, carbs: 12, fat: 0.5, servingSize: '12 oz', category: 'Drinks' },
  { name: 'Americano', calories: 15, protein: 1, carbs: 3, fat: 0, servingSize: '12 oz', category: 'Drinks' },
  { name: 'Mocha (whole milk)', calories: 260, protein: 10, carbs: 34, fat: 10, servingSize: '12 oz', category: 'Drinks' },
  { name: 'Flat White (whole milk)', calories: 180, protein: 10, carbs: 16, fat: 8, servingSize: '12 oz', category: 'Drinks' },
  { name: 'Macchiato (espresso)', calories: 13, protein: 0.5, carbs: 2, fat: 0.5, servingSize: '3 oz', category: 'Drinks' },

  // Drinks - Tea
  { name: 'Tea (black, unsweetened)', calories: 2, protein: 0, carbs: 0.7, fat: 0, servingSize: '8 oz', category: 'Drinks' },
  { name: 'Tea (green, unsweetened)', calories: 2, protein: 0.5, carbs: 0, fat: 0, servingSize: '8 oz', category: 'Drinks' },
  { name: 'Chai Latte (whole milk)', calories: 190, protein: 7, carbs: 32, fat: 5, servingSize: '12 oz', category: 'Drinks' },
  { name: 'Matcha Latte (whole milk)', calories: 170, protein: 7, carbs: 21, fat: 6, servingSize: '12 oz', category: 'Drinks' },

  // Drinks - Other Hot Beverages
  { name: 'Hot Chocolate (whole milk)', calories: 200, protein: 8, carbs: 26, fat: 7, servingSize: '8 oz', category: 'Drinks' },

  // Drinks - Juices
  { name: 'Orange Juice', calories: 110, protein: 2, carbs: 26, fat: 0.5, servingSize: '8 oz', category: 'Drinks' },
  { name: 'Apple Juice', calories: 120, protein: 0.3, carbs: 28, fat: 0.3, servingSize: '8 oz', category: 'Drinks' },
  { name: 'Cranberry Juice', calories: 140, protein: 0, carbs: 36, fat: 0, servingSize: '8 oz', category: 'Drinks' },
  { name: 'Grapefruit Juice', calories: 96, protein: 1.2, carbs: 23, fat: 0.2, servingSize: '8 oz', category: 'Drinks' },

  // Drinks - Soda & Energy
  { name: 'Coca-Cola', calories: 140, protein: 0, carbs: 39, fat: 0, servingSize: '12 oz can', category: 'Drinks' },
  { name: 'Diet Coke', calories: 0, protein: 0, carbs: 0, fat: 0, servingSize: '12 oz can', category: 'Drinks' },
  { name: 'Sprite', calories: 140, protein: 0, carbs: 38, fat: 0, servingSize: '12 oz can', category: 'Drinks' },
  { name: 'Red Bull (regular)', calories: 110, protein: 1, carbs: 27, fat: 0, servingSize: '8.4 oz can', category: 'Drinks' },
  { name: 'Red Bull (sugar-free)', calories: 10, protein: 1, carbs: 3, fat: 0, servingSize: '8.4 oz can', category: 'Drinks' },

  // Drinks - Protein & Smoothies
  { name: 'Protein Shake (whey, water)', calories: 120, protein: 24, carbs: 3, fat: 1.5, servingSize: '1 scoop (30g)', category: 'Drinks' },
  { name: 'Protein Shake (whey, milk)', calories: 280, protein: 32, carbs: 22, fat: 8, servingSize: '1 scoop + 8oz milk', category: 'Drinks' },
  { name: 'Smoothie (berry)', calories: 200, protein: 4, carbs: 42, fat: 2, servingSize: '12 oz', category: 'Drinks' },
  { name: 'Smoothie (green)', calories: 150, protein: 3, carbs: 32, fat: 1, servingSize: '12 oz', category: 'Drinks' },

  // Drinks - Alcohol
  { name: 'Beer (regular)', calories: 153, protein: 1.6, carbs: 13, fat: 0, servingSize: '12 oz', category: 'Drinks' },
  { name: 'Beer (light)', calories: 103, protein: 0.9, carbs: 5.8, fat: 0, servingSize: '12 oz', category: 'Drinks' },
  { name: 'Wine (red)', calories: 125, protein: 0.1, carbs: 3.8, fat: 0, servingSize: '5 oz', category: 'Drinks' },
  { name: 'Wine (white)', calories: 121, protein: 0.1, carbs: 3.8, fat: 0, servingSize: '5 oz', category: 'Drinks' },
  { name: 'Vodka (1 shot)', calories: 97, protein: 0, carbs: 0, fat: 0, servingSize: '1.5 oz', category: 'Drinks' },
  { name: 'Whiskey (1 shot)', calories: 105, protein: 0, carbs: 0, fat: 0, servingSize: '1.5 oz', category: 'Drinks' },

  // Drinks - Other
  { name: 'Water', calories: 0, protein: 0, carbs: 0, fat: 0, servingSize: '8 oz', category: 'Drinks' },
  { name: 'Sparkling Water', calories: 0, protein: 0, carbs: 0, fat: 0, servingSize: '8 oz', category: 'Drinks' },
  { name: 'Coconut Water', calories: 45, protein: 1.7, carbs: 9, fat: 0.5, servingSize: '8 oz', category: 'Drinks' },

  // Lunch & Dinner - Burgers & Fast Food
  { name: 'Hamburger (fast food)', calories: 354, protein: 16, carbs: 32, fat: 17, servingSize: '1 burger (120g)', category: 'Lunch & Dinner' },
  { name: 'Cheeseburger (fast food)', calories: 440, protein: 21, carbs: 35, fat: 24, servingSize: '1 burger (150g)', category: 'Lunch & Dinner' },
  { name: 'Double Cheeseburger', calories: 680, protein: 38, carbs: 40, fat: 40, servingSize: '1 burger', category: 'Lunch & Dinner' },
  { name: 'Big Mac', calories: 563, protein: 26, carbs: 46, fat: 33, servingSize: '1 burger', category: 'Lunch & Dinner' },
  { name: 'Whopper', calories: 657, protein: 28, carbs: 49, fat: 40, servingSize: '1 burger', category: 'Lunch & Dinner' },
  { name: 'Chicken Sandwich (grilled)', calories: 380, protein: 28, carbs: 44, fat: 9, servingSize: '1 sandwich', category: 'Lunch & Dinner' },
  { name: 'Chicken Sandwich (fried)', calories: 500, protein: 24, carbs: 48, fat: 23, servingSize: '1 sandwich', category: 'Lunch & Dinner' },
  { name: 'French Fries (small)', calories: 230, protein: 3, carbs: 29, fat: 11, servingSize: '1 small', category: 'Lunch & Dinner' },
  { name: 'French Fries (medium)', calories: 340, protein: 4, carbs: 44, fat: 16, servingSize: '1 medium', category: 'Lunch & Dinner' },
  { name: 'French Fries (large)', calories: 480, protein: 6, carbs: 63, fat: 23, servingSize: '1 large', category: 'Lunch & Dinner' },
  { name: 'Onion Rings (medium)', calories: 410, protein: 5, carbs: 53, fat: 20, servingSize: '1 serving', category: 'Lunch & Dinner' },
  { name: 'Chicken Nuggets (6 pieces)', calories: 270, protein: 15, carbs: 16, fat: 16, servingSize: '6 pieces', category: 'Lunch & Dinner' },
  { name: 'Chicken Nuggets (10 pieces)', calories: 450, protein: 25, carbs: 27, fat: 27, servingSize: '10 pieces', category: 'Lunch & Dinner' },
  { name: 'Chicken Tenders (3 pieces)', calories: 380, protein: 21, carbs: 24, fat: 22, servingSize: '3 pieces', category: 'Lunch & Dinner' },

  // Lunch & Dinner - Mexican
  { name: 'Burrito (chicken)', calories: 760, protein: 42, carbs: 98, fat: 22, servingSize: '1 burrito', category: 'Lunch & Dinner' },
  { name: 'Burrito (steak)', calories: 820, protein: 44, carbs: 96, fat: 28, servingSize: '1 burrito', category: 'Lunch & Dinner' },
  { name: 'Burrito (carnitas)', calories: 800, protein: 40, carbs: 95, fat: 26, servingSize: '1 burrito', category: 'Lunch & Dinner' },
  { name: 'Burrito (bean & cheese)', calories: 680, protein: 28, carbs: 102, fat: 18, servingSize: '1 burrito', category: 'Lunch & Dinner' },
  { name: 'Chipotle Bowl (chicken)', calories: 550, protein: 35, carbs: 65, fat: 15, servingSize: '1 bowl', category: 'Lunch & Dinner' },
  { name: 'Chipotle Bowl (steak)', calories: 600, protein: 36, carbs: 64, fat: 20, servingSize: '1 bowl', category: 'Lunch & Dinner' },
  { name: 'Enchiladas (2, chicken)', calories: 480, protein: 26, carbs: 42, fat: 22, servingSize: '2 enchiladas', category: 'Lunch & Dinner' },
  { name: 'Enchiladas (2, beef)', calories: 520, protein: 24, carbs: 44, fat: 26, servingSize: '2 enchiladas', category: 'Lunch & Dinner' },
  { name: 'Fajitas (chicken)', calories: 420, protein: 36, carbs: 32, fat: 16, servingSize: '1 serving', category: 'Lunch & Dinner' },
  { name: 'Fajitas (steak)', calories: 480, protein: 38, carbs: 30, fat: 22, servingSize: '1 serving', category: 'Lunch & Dinner' },
  { name: 'Taco Salad', calories: 780, protein: 32, carbs: 68, fat: 42, servingSize: '1 salad', category: 'Lunch & Dinner' },
  { name: 'Chips & Guacamole', calories: 380, protein: 6, carbs: 42, fat: 22, servingSize: '1 serving', category: 'Lunch & Dinner' },

  // Lunch & Dinner - Salads
  { name: 'House Salad (no dressing)', calories: 80, protein: 4, carbs: 12, fat: 2, servingSize: '1 salad', category: 'Lunch & Dinner' },
  { name: 'Caesar Salad (side)', calories: 240, protein: 8, carbs: 12, fat: 18, servingSize: '1 side', category: 'Lunch & Dinner' },
  { name: 'Caesar Salad (entree)', calories: 480, protein: 16, carbs: 24, fat: 36, servingSize: '1 entree', category: 'Lunch & Dinner' },
  { name: 'Grilled Chicken Salad', calories: 380, protein: 32, carbs: 14, fat: 22, servingSize: '1 salad', category: 'Lunch & Dinner' },
  { name: 'Southwest Chicken Salad', calories: 520, protein: 34, carbs: 38, fat: 26, servingSize: '1 salad', category: 'Lunch & Dinner' },
  { name: 'Asian Chicken Salad', calories: 440, protein: 28, carbs: 32, fat: 22, servingSize: '1 salad', category: 'Lunch & Dinner' },
  { name: 'Steak Salad', calories: 520, protein: 36, carbs: 18, fat: 34, servingSize: '1 salad', category: 'Lunch & Dinner' },
  { name: 'Chef Salad', calories: 420, protein: 28, carbs: 10, fat: 30, servingSize: '1 salad', category: 'Lunch & Dinner' },
  { name: 'Chopped Salad', calories: 360, protein: 18, carbs: 22, fat: 22, servingSize: '1 salad', category: 'Lunch & Dinner' },
  { name: 'Wedge Salad', calories: 480, protein: 12, carbs: 14, fat: 42, servingSize: '1 salad', category: 'Lunch & Dinner' },

  // Lunch & Dinner - Pasta Dishes
  { name: 'Spaghetti with Marinara', calories: 380, protein: 12, carbs: 68, fat: 6, servingSize: '1 plate', category: 'Lunch & Dinner' },
  { name: 'Spaghetti with Meatballs', calories: 620, protein: 32, carbs: 72, fat: 22, servingSize: '1 plate', category: 'Lunch & Dinner' },
  { name: 'Fettuccine Alfredo', calories: 720, protein: 24, carbs: 68, fat: 40, servingSize: '1 plate', category: 'Lunch & Dinner' },
  { name: 'Chicken Alfredo', calories: 880, protein: 48, carbs: 70, fat: 44, servingSize: '1 plate', category: 'Lunch & Dinner' },
  { name: 'Shrimp Scampi Pasta', calories: 640, protein: 34, carbs: 64, fat: 26, servingSize: '1 plate', category: 'Lunch & Dinner' },
  { name: 'Penne Vodka', calories: 580, protein: 18, carbs: 72, fat: 24, servingSize: '1 plate', category: 'Lunch & Dinner' },
  { name: 'Chicken Parmigiana (with pasta)', calories: 780, protein: 46, carbs: 68, fat: 34, servingSize: '1 plate', category: 'Lunch & Dinner' },
  { name: 'Lasagna (meat)', calories: 420, protein: 24, carbs: 36, fat: 20, servingSize: '1 slice', category: 'Lunch & Dinner' },
  { name: 'Baked Ziti', calories: 480, protein: 22, carbs: 54, fat: 18, servingSize: '1 serving', category: 'Lunch & Dinner' },

  // Lunch & Dinner - Chicken Dishes
  { name: 'Grilled Chicken Breast (with sides)', calories: 420, protein: 48, carbs: 32, fat: 10, servingSize: '1 plate', category: 'Lunch & Dinner' },
  { name: 'BBQ Chicken (1/4 chicken)', calories: 480, protein: 42, carbs: 18, fat: 26, servingSize: '1/4 chicken', category: 'Lunch & Dinner' },
  { name: 'Fried Chicken (2 pieces)', calories: 540, protein: 36, carbs: 18, fat: 36, servingSize: '2 pieces', category: 'Lunch & Dinner' },
  { name: 'Buffalo Wings (8 pieces)', calories: 680, protein: 48, carbs: 6, fat: 52, servingSize: '8 wings', category: 'Lunch & Dinner' },
  { name: 'Chicken Teriyaki Bowl', calories: 560, protein: 38, carbs: 76, fat: 10, servingSize: '1 bowl', category: 'Lunch & Dinner' },
  { name: 'Orange Chicken (with rice)', calories: 820, protein: 28, carbs: 116, fat: 26, servingSize: '1 plate', category: 'Lunch & Dinner' },
  { name: 'General Tso\'s Chicken (with rice)', calories: 880, protein: 32, carbs: 120, fat: 30, servingSize: '1 plate', category: 'Lunch & Dinner' },
  { name: 'Chicken Fried Rice', calories: 540, protein: 22, carbs: 72, fat: 16, servingSize: '1 plate', category: 'Lunch & Dinner' },
  { name: 'Sesame Chicken (with rice)', calories: 840, protein: 30, carbs: 114, fat: 28, servingSize: '1 plate', category: 'Lunch & Dinner' },

  // Lunch & Dinner - Beef Dishes
  { name: 'Steak (8 oz sirloin)', calories: 440, protein: 58, carbs: 0, fat: 22, servingSize: '8 oz', category: 'Lunch & Dinner' },
  { name: 'Steak Dinner (with sides)', calories: 720, protein: 62, carbs: 42, fat: 32, servingSize: '1 plate', category: 'Lunch & Dinner' },
  { name: 'Beef Tacos (3)', calories: 540, protein: 28, carbs: 48, fat: 26, servingSize: '3 tacos', category: 'Lunch & Dinner' },
  { name: 'Meatloaf (with gravy)', calories: 480, protein: 32, carbs: 22, fat: 28, servingSize: '1 slice', category: 'Lunch & Dinner' },
  { name: 'Pot Roast (with vegetables)', calories: 520, protein: 42, carbs: 28, fat: 24, servingSize: '1 serving', category: 'Lunch & Dinner' },
  { name: 'Beef Stir Fry (with rice)', calories: 620, protein: 34, carbs: 68, fat: 20, servingSize: '1 plate', category: 'Lunch & Dinner' },

  // Lunch & Dinner - Seafood
  { name: 'Fish & Chips', calories: 840, protein: 38, carbs: 84, fat: 40, servingSize: '1 serving', category: 'Lunch & Dinner' },
  { name: 'Grilled Salmon (with sides)', calories: 520, protein: 44, carbs: 32, fat: 22, servingSize: '1 plate', category: 'Lunch & Dinner' },
  { name: 'Shrimp Cocktail', calories: 140, protein: 24, carbs: 12, fat: 1, servingSize: '1 serving', category: 'Lunch & Dinner' },
  { name: 'Lobster Roll', calories: 520, protein: 28, carbs: 42, fat: 24, servingSize: '1 roll', category: 'Lunch & Dinner' },
  { name: 'Clam Chowder (bowl)', calories: 380, protein: 18, carbs: 32, fat: 20, servingSize: '1 bowl', category: 'Lunch & Dinner' },
  { name: 'Seafood Pasta', calories: 680, protein: 36, carbs: 72, fat: 24, servingSize: '1 plate', category: 'Lunch & Dinner' },

  // Lunch & Dinner - Rice & Grain Bowls
  { name: 'Fried Rice (vegetable)', calories: 420, protein: 10, carbs: 68, fat: 12, servingSize: '1 plate', category: 'Lunch & Dinner' },
  { name: 'Fried Rice (chicken)', calories: 540, protein: 22, carbs: 72, fat: 16, servingSize: '1 plate', category: 'Lunch & Dinner' },
  { name: 'Fried Rice (shrimp)', calories: 520, protein: 24, carbs: 70, fat: 14, servingSize: '1 plate', category: 'Lunch & Dinner' },
  { name: 'Rice & Beans', calories: 380, protein: 14, carbs: 72, fat: 4, servingSize: '1 serving', category: 'Lunch & Dinner' },
  { name: 'Chicken & Rice', calories: 520, protein: 38, carbs: 64, fat: 10, servingSize: '1 plate', category: 'Lunch & Dinner' },
  { name: 'Buddha Bowl', calories: 480, protein: 16, carbs: 72, fat: 14, servingSize: '1 bowl', category: 'Lunch & Dinner' },
  { name: 'Mediterranean Bowl', calories: 520, protein: 22, carbs: 64, fat: 18, servingSize: '1 bowl', category: 'Lunch & Dinner' },

  // Lunch & Dinner - Soups
  { name: 'Tomato Soup (bowl)', calories: 180, protein: 4, carbs: 28, fat: 6, servingSize: '1 bowl', category: 'Lunch & Dinner' },
  { name: 'Chicken Noodle Soup (bowl)', calories: 220, protein: 16, carbs: 26, fat: 6, servingSize: '1 bowl', category: 'Lunch & Dinner' },
  { name: 'Broccoli Cheddar Soup (bowl)', calories: 360, protein: 12, carbs: 24, fat: 24, servingSize: '1 bowl', category: 'Lunch & Dinner' },
  { name: 'French Onion Soup (bowl)', calories: 280, protein: 12, carbs: 26, fat: 14, servingSize: '1 bowl', category: 'Lunch & Dinner' },
  { name: 'Loaded Baked Potato Soup (bowl)', calories: 380, protein: 14, carbs: 32, fat: 22, servingSize: '1 bowl', category: 'Lunch & Dinner' },
  { name: 'Chili (beef, bowl)', calories: 340, protein: 24, carbs: 28, fat: 16, servingSize: '1 bowl', category: 'Lunch & Dinner' },

  // Lunch & Dinner - Deli & Subs
  { name: 'Turkey Sub (6 inch)', calories: 280, protein: 18, carbs: 46, fat: 4, servingSize: '6 inch', category: 'Lunch & Dinner' },
  { name: 'Turkey Sub (12 inch)', calories: 560, protein: 36, carbs: 92, fat: 8, servingSize: '12 inch', category: 'Lunch & Dinner' },
  { name: 'Italian Sub (6 inch)', calories: 480, protein: 22, carbs: 46, fat: 22, servingSize: '6 inch', category: 'Lunch & Dinner' },
  { name: 'Italian Sub (12 inch)', calories: 960, protein: 44, carbs: 92, fat: 44, servingSize: '12 inch', category: 'Lunch & Dinner' },
  { name: 'Veggie Sub (6 inch)', calories: 230, protein: 8, carbs: 44, fat: 3, servingSize: '6 inch', category: 'Lunch & Dinner' },
  { name: 'Tuna Sub (6 inch)', calories: 480, protein: 24, carbs: 46, fat: 22, servingSize: '6 inch', category: 'Lunch & Dinner' },
  { name: 'Steak & Cheese Sub (6 inch)', calories: 520, protein: 28, carbs: 48, fat: 24, servingSize: '6 inch', category: 'Lunch & Dinner' },
  { name: 'Meatball Sub (6 inch)', calories: 560, protein: 26, carbs: 52, fat: 26, servingSize: '6 inch', category: 'Lunch & Dinner' },

  // Lunch & Dinner - Wraps
  { name: 'Chicken Caesar Wrap', calories: 520, protein: 30, carbs: 44, fat: 24, servingSize: '1 wrap', category: 'Lunch & Dinner' },
  { name: 'Turkey Avocado Wrap', calories: 480, protein: 26, carbs: 42, fat: 22, servingSize: '1 wrap', category: 'Lunch & Dinner' },
  { name: 'Buffalo Chicken Wrap', calories: 560, protein: 32, carbs: 46, fat: 26, servingSize: '1 wrap', category: 'Lunch & Dinner' },
  { name: 'Veggie Wrap', calories: 380, protein: 12, carbs: 52, fat: 14, servingSize: '1 wrap', category: 'Lunch & Dinner' },
  { name: 'Greek Wrap', calories: 450, protein: 22, carbs: 48, fat: 18, servingSize: '1 wrap', category: 'Lunch & Dinner' },

  // Lunch & Dinner - Sides
  { name: 'Mashed Potatoes (1 cup)', calories: 240, protein: 4, carbs: 36, fat: 9, servingSize: '1 cup', category: 'Lunch & Dinner' },
  { name: 'Mac & Cheese (side)', calories: 320, protein: 12, carbs: 36, fat: 14, servingSize: '1 side', category: 'Lunch & Dinner' },
  { name: 'Coleslaw (1 cup)', calories: 180, protein: 2, carbs: 14, fat: 14, servingSize: '1 cup', category: 'Lunch & Dinner' },
  { name: 'Baked Beans (1 cup)', calories: 240, protein: 12, carbs: 48, fat: 2, servingSize: '1 cup', category: 'Lunch & Dinner' },
  { name: 'Corn on the Cob (1 ear)', calories: 90, protein: 3, carbs: 19, fat: 1.5, servingSize: '1 ear', category: 'Lunch & Dinner' },
  { name: 'Side Salad (with dressing)', calories: 140, protein: 3, carbs: 12, fat: 9, servingSize: '1 salad', category: 'Lunch & Dinner' },
  { name: 'Garlic Bread (2 slices)', calories: 280, protein: 6, carbs: 36, fat: 12, servingSize: '2 slices', category: 'Lunch & Dinner' },
  { name: 'Breadsticks (2 sticks)', calories: 220, protein: 6, carbs: 34, fat: 6, servingSize: '2 sticks', category: 'Lunch & Dinner' },

  // Pizza - Various Toppings
  { name: 'Pizza (cheese, 1 slice)', calories: 272, protein: 12, carbs: 34, fat: 10, servingSize: '1 slice (107g)', category: 'Pizza' },
  { name: 'Pizza (pepperoni, 1 slice)', calories: 298, protein: 13, carbs: 34, fat: 13, servingSize: '1 slice (110g)', category: 'Pizza' },
  { name: 'Pizza (sausage, 1 slice)', calories: 305, protein: 13, carbs: 33, fat: 14, servingSize: '1 slice (115g)', category: 'Pizza' },
  { name: 'Pizza (supreme, 1 slice)', calories: 312, protein: 14, carbs: 32, fat: 15, servingSize: '1 slice (130g)', category: 'Pizza' },
  { name: 'Pizza (meat lovers, 1 slice)', calories: 340, protein: 16, carbs: 32, fat: 17, servingSize: '1 slice (135g)', category: 'Pizza' },
  { name: 'Pizza (Hawaiian, 1 slice)', calories: 285, protein: 13, carbs: 36, fat: 11, servingSize: '1 slice (120g)', category: 'Pizza' },
  { name: 'Pizza (vegetarian, 1 slice)', calories: 260, protein: 11, carbs: 35, fat: 9, servingSize: '1 slice (120g)', category: 'Pizza' },
  { name: 'Pizza (margherita, 1 slice)', calories: 240, protein: 11, carbs: 30, fat: 9, servingSize: '1 slice (100g)', category: 'Pizza' },
  { name: 'Pizza (BBQ chicken, 1 slice)', calories: 295, protein: 15, carbs: 36, fat: 10, servingSize: '1 slice (125g)', category: 'Pizza' },
  { name: 'Pizza (white pizza, 1 slice)', calories: 280, protein: 13, carbs: 32, fat: 12, servingSize: '1 slice (110g)', category: 'Pizza' },
  { name: 'Pizza (buffalo chicken, 1 slice)', calories: 300, protein: 14, carbs: 33, fat: 12, servingSize: '1 slice (120g)', category: 'Pizza' },
  { name: 'Pizza (mushroom, 1 slice)', calories: 265, protein: 12, carbs: 34, fat: 10, servingSize: '1 slice (110g)', category: 'Pizza' },
  { name: 'Pizza (four cheese, 1 slice)', calories: 290, protein: 14, carbs: 32, fat: 13, servingSize: '1 slice (110g)', category: 'Pizza' },
  { name: 'Pizza (thin crust cheese, 1 slice)', calories: 215, protein: 10, carbs: 22, fat: 10, servingSize: '1 slice (75g)', category: 'Pizza' },
  { name: 'Pizza (thin crust pepperoni, 1 slice)', calories: 230, protein: 11, carbs: 22, fat: 12, servingSize: '1 slice (80g)', category: 'Pizza' },
  { name: 'Pizza (deep dish cheese, 1 slice)', calories: 380, protein: 15, carbs: 42, fat: 16, servingSize: '1 slice (150g)', category: 'Pizza' },
  { name: 'Pizza (deep dish pepperoni, 1 slice)', calories: 420, protein: 17, carbs: 42, fat: 20, servingSize: '1 slice (160g)', category: 'Pizza' },

  // Japanese Cuisine
  { name: 'Sushi Roll (California)', calories: 255, protein: 9, carbs: 38, fat: 7, servingSize: '6 pieces', category: 'Japanese' },
  { name: 'Sushi Roll (Spicy Tuna)', calories: 290, protein: 24, carbs: 26, fat: 11, servingSize: '6 pieces', category: 'Japanese' },
  { name: 'Sushi Roll (Salmon)', calories: 304, protein: 13, carbs: 42, fat: 9, servingSize: '6 pieces', category: 'Japanese' },
  { name: 'Nigiri (Salmon, 2 pieces)', calories: 140, protein: 10, carbs: 16, fat: 4, servingSize: '2 pieces', category: 'Japanese' },
  { name: 'Nigiri (Tuna, 2 pieces)', calories: 110, protein: 12, carbs: 14, fat: 1, servingSize: '2 pieces', category: 'Japanese' },
  { name: 'Sashimi (Salmon, 3 pieces)', calories: 104, protein: 12, carbs: 0, fat: 6, servingSize: '3 pieces (75g)', category: 'Japanese' },
  { name: 'Sashimi (Tuna, 3 pieces)', calories: 92, protein: 20, carbs: 0, fat: 1, servingSize: '3 pieces (75g)', category: 'Japanese' },
  { name: 'Edamame', calories: 122, protein: 11, carbs: 10, fat: 5, servingSize: '100g', category: 'Japanese' },
  { name: 'Miso Soup', calories: 40, protein: 3, carbs: 5, fat: 1, servingSize: '1 cup', category: 'Japanese' },
  { name: 'Ramen (chicken)', calories: 436, protein: 23, carbs: 65, fat: 10, servingSize: '1 bowl', category: 'Japanese' },
  { name: 'Ramen (pork)', calories: 500, protein: 25, carbs: 66, fat: 15, servingSize: '1 bowl', category: 'Japanese' },
  { name: 'Teriyaki Chicken Bowl', calories: 430, protein: 28, carbs: 62, fat: 7, servingSize: '1 bowl', category: 'Japanese' },

  // Thai Cuisine
  { name: 'Pad Thai (chicken)', calories: 355, protein: 18, carbs: 40, fat: 13, servingSize: '1 plate (350g)', category: 'Thai' },
  { name: 'Pad Thai (shrimp)', calories: 330, protein: 20, carbs: 39, fat: 11, servingSize: '1 plate (350g)', category: 'Thai' },
  { name: 'Green Curry (chicken)', calories: 235, protein: 20, carbs: 12, fat: 13, servingSize: '1 cup', category: 'Thai' },
  { name: 'Red Curry (chicken)', calories: 245, protein: 18, carbs: 13, fat: 14, servingSize: '1 cup', category: 'Thai' },
  { name: 'Thai Fried Rice', calories: 280, protein: 12, carbs: 42, fat: 8, servingSize: '1 cup', category: 'Thai' },
  { name: 'Tom Yum Soup', calories: 90, protein: 10, carbs: 9, fat: 2, servingSize: '1 cup', category: 'Thai' },
  { name: 'Spring Rolls (fresh, 2 pieces)', calories: 160, protein: 5, carbs: 25, fat: 4, servingSize: '2 rolls', category: 'Thai' },

  // Vietnamese Cuisine
  { name: 'Pho (beef)', calories: 350, protein: 30, carbs: 45, fat: 6, servingSize: '1 bowl', category: 'Vietnamese' },
  { name: 'Pho (chicken)', calories: 300, protein: 28, carbs: 42, fat: 3, servingSize: '1 bowl', category: 'Vietnamese' },
  { name: 'Banh Mi (pork)', calories: 420, protein: 22, carbs: 42, fat: 16, servingSize: '1 sandwich', category: 'Vietnamese' },
  { name: 'Banh Mi (chicken)', calories: 380, protein: 24, carbs: 40, fat: 12, servingSize: '1 sandwich', category: 'Vietnamese' },
  { name: 'Vermicelli Bowl (grilled pork)', calories: 390, protein: 25, carbs: 52, fat: 8, servingSize: '1 bowl', category: 'Vietnamese' },

  // Chinese Cuisine
  { name: 'Fried Rice (chicken)', calories: 235, protein: 12, carbs: 32, fat: 7, servingSize: '1 cup', category: 'Chinese' },
  { name: 'Fried Rice (shrimp)', calories: 220, protein: 13, carbs: 31, fat: 5, servingSize: '1 cup', category: 'Chinese' },
  { name: 'Lo Mein (chicken)', calories: 300, protein: 15, carbs: 40, fat: 9, servingSize: '1 cup', category: 'Chinese' },
  { name: 'Orange Chicken', calories: 420, protein: 20, carbs: 48, fat: 16, servingSize: '1 cup', category: 'Chinese' },
  { name: 'General Tso\'s Chicken', calories: 450, protein: 22, carbs: 52, fat: 17, servingSize: '1 cup', category: 'Chinese' },
  { name: 'Beef and Broccoli', calories: 260, protein: 18, carbs: 15, fat: 14, servingSize: '1 cup', category: 'Chinese' },
  { name: 'Dumplings (steamed, 4 pieces)', calories: 200, protein: 10, carbs: 28, fat: 5, servingSize: '4 dumplings', category: 'Chinese' },
  { name: 'Dumplings (fried, 4 pieces)', calories: 280, protein: 10, carbs: 30, fat: 13, servingSize: '4 dumplings', category: 'Chinese' },
  { name: 'Hot and Sour Soup', calories: 90, protein: 6, carbs: 10, fat: 3, servingSize: '1 cup', category: 'Chinese' },
  { name: 'Egg Drop Soup', calories: 70, protein: 4, carbs: 8, fat: 2, servingSize: '1 cup', category: 'Chinese' },

  // Korean Cuisine
  { name: 'Bibimbap', calories: 490, protein: 22, carbs: 68, fat: 14, servingSize: '1 bowl', category: 'Korean' },
  { name: 'Korean BBQ (beef)', calories: 280, protein: 26, carbs: 5, fat: 17, servingSize: '100g', category: 'Korean' },
  { name: 'Kimchi', calories: 15, protein: 1, carbs: 2, fat: 0.5, servingSize: '100g', category: 'Korean' },
  { name: 'Japchae (glass noodles)', calories: 250, protein: 8, carbs: 42, fat: 6, servingSize: '1 cup', category: 'Korean' },

  // Indian Cuisine
  { name: 'Chicken Tikka Masala', calories: 300, protein: 24, carbs: 12, fat: 18, servingSize: '1 cup', category: 'Indian' },
  { name: 'Butter Chicken', calories: 320, protein: 22, carbs: 10, fat: 22, servingSize: '1 cup', category: 'Indian' },
  { name: 'Chicken Curry', calories: 280, protein: 20, carbs: 14, fat: 16, servingSize: '1 cup', category: 'Indian' },
  { name: 'Palak Paneer (spinach curry)', calories: 270, protein: 12, carbs: 10, fat: 20, servingSize: '1 cup', category: 'Indian' },
  { name: 'Naan Bread (1 piece)', calories: 262, protein: 9, carbs: 45, fat: 5, servingSize: '1 naan', category: 'Indian' },
  { name: 'Samosa (1 piece)', calories: 140, protein: 3, carbs: 18, fat: 6, servingSize: '1 samosa', category: 'Indian' },
  { name: 'Tandoori Chicken', calories: 260, protein: 38, carbs: 5, fat: 10, servingSize: '1 serving (200g)', category: 'Indian' },

  // Mediterranean/Middle Eastern
  { name: 'Hummus', calories: 166, protein: 8, carbs: 14, fat: 10, servingSize: '100g', category: 'Mediterranean' },
  { name: 'Falafel (3 pieces)', calories: 180, protein: 7, carbs: 18, fat: 9, servingSize: '3 pieces', category: 'Mediterranean' },
  { name: 'Shawarma (chicken)', calories: 350, protein: 30, carbs: 28, fat: 12, servingSize: '1 wrap', category: 'Mediterranean' },
  { name: 'Shawarma (beef)', calories: 400, protein: 28, carbs: 30, fat: 18, servingSize: '1 wrap', category: 'Mediterranean' },
  { name: 'Gyro (lamb)', calories: 445, protein: 25, carbs: 35, fat: 22, servingSize: '1 gyro', category: 'Mediterranean' },
  { name: 'Gyro (chicken)', calories: 380, protein: 28, carbs: 34, fat: 14, servingSize: '1 gyro', category: 'Mediterranean' },
  { name: 'Kebab (chicken)', calories: 230, protein: 30, carbs: 2, fat: 11, servingSize: '1 skewer (150g)', category: 'Mediterranean' },
  { name: 'Kebab (lamb)', calories: 310, protein: 26, carbs: 2, fat: 22, servingSize: '1 skewer (150g)', category: 'Mediterranean' },
  { name: 'Tabbouleh', calories: 120, protein: 3, carbs: 15, fat: 6, servingSize: '1 cup', category: 'Mediterranean' },
  { name: 'Baba Ganoush', calories: 80, protein: 2, carbs: 8, fat: 5, servingSize: '100g', category: 'Mediterranean' },

  // Mexican/Latin American
  { name: 'Taco (chicken, soft)', calories: 180, protein: 12, carbs: 16, fat: 8, servingSize: '1 taco', category: 'Mexican' },
  { name: 'Taco (beef, soft)', calories: 210, protein: 11, carbs: 16, fat: 12, servingSize: '1 taco', category: 'Mexican' },
  { name: 'Burrito Bowl (chicken)', calories: 550, protein: 35, carbs: 65, fat: 15, servingSize: '1 bowl', category: 'Mexican' },
  { name: 'Burrito Bowl (steak)', calories: 600, protein: 36, carbs: 64, fat: 20, servingSize: '1 bowl', category: 'Mexican' },
  { name: 'Quesadilla (cheese)', calories: 480, protein: 20, carbs: 40, fat: 26, servingSize: '1 quesadilla', category: 'Mexican' },
  { name: 'Quesadilla (chicken)', calories: 540, protein: 32, carbs: 42, fat: 24, servingSize: '1 quesadilla', category: 'Mexican' },
  { name: 'Guacamole', calories: 161, protein: 2, carbs: 9, fat: 15, servingSize: '100g', category: 'Mexican' },
  { name: 'Chips and Salsa', calories: 180, protein: 3, carbs: 28, fat: 7, servingSize: '1 serving', category: 'Mexican' },
  { name: 'Nachos (cheese)', calories: 350, protein: 12, carbs: 35, fat: 18, servingSize: '1 serving', category: 'Mexican' },

  // Italian (beyond basics)
  { name: 'Risotto (mushroom)', calories: 280, protein: 8, carbs: 45, fat: 8, servingSize: '1 cup', category: 'Italian' },
  { name: 'Carbonara Pasta', calories: 380, protein: 16, carbs: 42, fat: 16, servingSize: '1 cup', category: 'Italian' },
  { name: 'Bolognese Pasta', calories: 320, protein: 18, carbs: 40, fat: 10, servingSize: '1 cup', category: 'Italian' },
  { name: 'Lasagna', calories: 315, protein: 18, carbs: 26, fat: 15, servingSize: '1 slice (200g)', category: 'Italian' },
  { name: 'Ravioli (cheese)', calories: 220, protein: 11, carbs: 30, fat: 7, servingSize: '1 cup', category: 'Italian' },
  { name: 'Caprese Salad', calories: 200, protein: 12, carbs: 6, fat: 14, servingSize: '1 serving', category: 'Italian' },
  { name: 'Bruschetta (2 pieces)', calories: 150, protein: 5, carbs: 22, fat: 5, servingSize: '2 pieces', category: 'Italian' },

  // French
  { name: 'Croissant', calories: 231, protein: 5, carbs: 26, fat: 12, servingSize: '1 croissant (50g)', category: 'French' },
  { name: 'Pain au Chocolat', calories: 280, protein: 5, carbs: 33, fat: 14, servingSize: '1 pastry', category: 'French' },
  { name: 'Quiche Lorraine', calories: 350, protein: 14, carbs: 20, fat: 24, servingSize: '1 slice', category: 'French' },
  { name: 'French Onion Soup', calories: 190, protein: 8, carbs: 16, fat: 10, servingSize: '1 bowl', category: 'French' },
  { name: 'Croque Monsieur', calories: 450, protein: 22, carbs: 35, fat: 24, servingSize: '1 sandwich', category: 'French' },

  // Modern/Trendy Urban Foods
  { name: 'Avocado Toast', calories: 280, protein: 8, carbs: 32, fat: 14, servingSize: '1 serving', category: 'Modern' },
  { name: 'Acai Bowl', calories: 340, protein: 5, carbs: 58, fat: 12, servingSize: '1 bowl', category: 'Modern' },
  { name: 'Poke Bowl (tuna)', calories: 420, protein: 28, carbs: 52, fat: 10, servingSize: '1 bowl', category: 'Modern' },
  { name: 'Poke Bowl (salmon)', calories: 450, protein: 26, carbs: 52, fat: 14, servingSize: '1 bowl', category: 'Modern' },
  { name: 'Grain Bowl (quinoa, chicken)', calories: 480, protein: 32, carbs: 54, fat: 14, servingSize: '1 bowl', category: 'Modern' },
  { name: 'Buddha Bowl (vegan)', calories: 380, protein: 12, carbs: 62, fat: 10, servingSize: '1 bowl', category: 'Modern' },
  { name: 'Smoothie Bowl (berry)', calories: 320, protein: 8, carbs: 58, fat: 7, servingSize: '1 bowl', category: 'Modern' },
  { name: 'Chia Pudding', calories: 180, protein: 6, carbs: 22, fat: 8, servingSize: '1 cup', category: 'Modern' },
  { name: 'Overnight Oats', calories: 220, protein: 8, carbs: 36, fat: 5, servingSize: '1 cup', category: 'Modern' },
  { name: 'Protein Bar', calories: 200, protein: 20, carbs: 22, fat: 6, servingSize: '1 bar (60g)', category: 'Modern' },
  { name: 'Energy Ball (2 pieces)', calories: 140, protein: 4, carbs: 18, fat: 6, servingSize: '2 balls', category: 'Modern' },

  // Homemade Recipes - Soups & Stews
  { name: 'Fish Chowder', calories: 280, protein: 22, carbs: 25, fat: 10, servingSize: '1 bowl', category: 'Homemade' },
  { name: 'New England Clam Chowder', calories: 320, protein: 18, carbs: 28, fat: 15, servingSize: '1 bowl', category: 'Homemade' },
  { name: 'Chicken Noodle Soup', calories: 180, protein: 15, carbs: 20, fat: 5, servingSize: '1 bowl', category: 'Homemade' },
  { name: 'Minestrone Soup', calories: 140, protein: 6, carbs: 22, fat: 4, servingSize: '1 bowl', category: 'Homemade' },
  { name: 'French Lentil Soup', calories: 220, protein: 14, carbs: 35, fat: 3, servingSize: '1 bowl', category: 'Homemade' },
  { name: 'Butternut Squash Soup', calories: 180, protein: 4, carbs: 28, fat: 7, servingSize: '1 bowl', category: 'Homemade' },
  { name: 'Tomato Bisque', calories: 210, protein: 5, carbs: 24, fat: 11, servingSize: '1 bowl', category: 'Homemade' },
  { name: 'Beef Stew', calories: 340, protein: 28, carbs: 26, fat: 14, servingSize: '1 bowl', category: 'Homemade' },
  { name: 'Chicken Tortilla Soup', calories: 260, protein: 20, carbs: 22, fat: 10, servingSize: '1 bowl', category: 'Homemade' },
  { name: 'White Bean and Kale Soup', calories: 200, protein: 11, carbs: 30, fat: 4, servingSize: '1 bowl', category: 'Homemade' },

  // Homemade Recipes - Chicken Dishes
  { name: 'Chicken with 40 Cloves of Garlic', calories: 380, protein: 42, carbs: 12, fat: 18, servingSize: '1 serving', category: 'Homemade' },
  { name: 'Roast Chicken (1/4 chicken)', calories: 420, protein: 48, carbs: 2, fat: 24, servingSize: '1/4 chicken', category: 'Homemade' },
  { name: 'Chicken Cacciatore', calories: 320, protein: 36, carbs: 14, fat: 13, servingSize: '1 serving', category: 'Homemade' },
  { name: 'Chicken Piccata', calories: 360, protein: 38, carbs: 8, fat: 19, servingSize: '1 serving', category: 'Homemade' },
  { name: 'Chicken Marsala', calories: 380, protein: 40, carbs: 12, fat: 18, servingSize: '1 serving', category: 'Homemade' },
  { name: 'Coq au Vin', calories: 420, protein: 38, carbs: 16, fat: 22, servingSize: '1 serving', category: 'Homemade' },
  { name: 'Sheet Pan Chicken & Vegetables', calories: 340, protein: 38, carbs: 18, fat: 12, servingSize: '1 serving', category: 'Homemade' },
  { name: 'Lemon Herb Roasted Chicken', calories: 380, protein: 42, carbs: 4, fat: 21, servingSize: '1 serving', category: 'Homemade' },

  // Homemade Recipes - Pasta & Casseroles
  { name: 'Baked Ziti', calories: 380, protein: 18, carbs: 42, fat: 15, servingSize: '1 serving', category: 'Homemade' },
  { name: 'Eggplant Parmesan', calories: 360, protein: 16, carbs: 32, fat: 18, servingSize: '1 serving', category: 'Homemade' },
  { name: 'Chicken Parmesan', calories: 480, protein: 38, carbs: 28, fat: 22, servingSize: '1 serving', category: 'Homemade' },
  { name: 'Mac and Cheese (homemade)', calories: 420, protein: 18, carbs: 42, fat: 20, servingSize: '1 cup', category: 'Homemade' },
  { name: 'Spaghetti Aglio e Olio', calories: 340, protein: 10, carbs: 48, fat: 13, servingSize: '1 serving', category: 'Homemade' },
  { name: 'Cacio e Pepe', calories: 480, protein: 18, carbs: 54, fat: 20, servingSize: '1 serving', category: 'Homemade' },
  { name: 'Pasta Primavera', calories: 320, protein: 12, carbs: 48, fat: 10, servingSize: '1 serving', category: 'Homemade' },
  { name: 'Pasta Puttanesca', calories: 360, protein: 12, carbs: 52, fat: 12, servingSize: '1 serving', category: 'Homemade' },
  { name: 'Baked Manicotti', calories: 400, protein: 20, carbs: 38, fat: 18, servingSize: '1 serving', category: 'Homemade' },

  // Homemade Recipes - One-Pot Meals & Casseroles
  { name: 'Shepherd\'s Pie', calories: 380, protein: 22, carbs: 32, fat: 18, servingSize: '1 serving', category: 'Homemade' },
  { name: 'Chicken Pot Pie', calories: 520, protein: 24, carbs: 42, fat: 28, servingSize: '1 serving', category: 'Homemade' },
  { name: 'Beef Stroganoff', calories: 440, protein: 28, carbs: 32, fat: 22, servingSize: '1 serving', category: 'Homemade' },
  { name: 'Chicken and Rice Casserole', calories: 360, protein: 26, carbs: 38, fat: 10, servingSize: '1 serving', category: 'Homemade' },
  { name: 'Green Bean Casserole', calories: 180, protein: 5, carbs: 16, fat: 11, servingSize: '1 serving', category: 'Homemade' },
  { name: 'Tuna Casserole', calories: 320, protein: 22, carbs: 32, fat: 12, servingSize: '1 serving', category: 'Homemade' },
  { name: 'Jambalaya', calories: 380, protein: 24, carbs: 42, fat: 12, servingSize: '1 bowl', category: 'Homemade' },
  { name: 'Paella', calories: 420, protein: 28, carbs: 48, fat: 12, servingSize: '1 serving', category: 'Homemade' },

  // Homemade Recipes - Fish & Seafood
  { name: 'Salmon with Lemon & Dill', calories: 340, protein: 34, carbs: 2, fat: 22, servingSize: '1 fillet (150g)', category: 'Homemade' },
  { name: 'Baked Cod with Herbs', calories: 220, protein: 32, carbs: 4, fat: 8, servingSize: '1 fillet (150g)', category: 'Homemade' },
  { name: 'Shrimp Scampi', calories: 320, protein: 28, carbs: 12, fat: 18, servingSize: '1 serving', category: 'Homemade' },
  { name: 'Fish Tacos (2 tacos)', calories: 380, protein: 26, carbs: 36, fat: 14, servingSize: '2 tacos', category: 'Homemade' },
  { name: 'Crab Cakes (2 cakes)', calories: 340, protein: 22, carbs: 18, fat: 20, servingSize: '2 cakes', category: 'Homemade' },

  // Homemade Recipes - Vegetarian/Sides
  { name: 'Ratatouille', calories: 140, protein: 4, carbs: 18, fat: 6, servingSize: '1 cup', category: 'Homemade' },
  { name: 'Roasted Brussels Sprouts', calories: 120, protein: 4, carbs: 12, fat: 7, servingSize: '1 cup', category: 'Homemade' },
  { name: 'Roasted Root Vegetables', calories: 180, protein: 3, carbs: 28, fat: 7, servingSize: '1 cup', category: 'Homemade' },
  { name: 'Scalloped Potatoes', calories: 260, protein: 8, carbs: 32, fat: 12, servingSize: '1 serving', category: 'Homemade' },
  { name: 'Creamed Spinach', calories: 180, protein: 8, carbs: 10, fat: 13, servingSize: '1 cup', category: 'Homemade' },
  { name: 'Glazed Carrots', calories: 110, protein: 1, carbs: 18, fat: 4, servingSize: '1 cup', category: 'Homemade' },
  { name: 'Cauliflower Gratin', calories: 220, protein: 10, carbs: 14, fat: 15, servingSize: '1 serving', category: 'Homemade' },
  { name: 'Stuffed Bell Peppers', calories: 280, protein: 18, carbs: 32, fat: 10, servingSize: '1 pepper', category: 'Homemade' },

  // Homemade Recipes - Salads
  { name: 'Caesar Salad', calories: 240, protein: 8, carbs: 12, fat: 18, servingSize: '1 serving', category: 'Homemade' },
  { name: 'Chicken Caesar Salad', calories: 380, protein: 32, carbs: 14, fat: 22, servingSize: '1 serving', category: 'Homemade' },
  { name: 'Greek Salad', calories: 180, protein: 6, carbs: 12, fat: 13, servingSize: '1 serving', category: 'Homemade' },
  { name: 'Cobb Salad', calories: 420, protein: 28, carbs: 10, fat: 30, servingSize: '1 serving', category: 'Homemade' },
  { name: 'Kale Caesar Salad', calories: 220, protein: 7, carbs: 15, fat: 16, servingSize: '1 serving', category: 'Homemade' },
  { name: 'Arugula Salad with Parmesan', calories: 140, protein: 6, carbs: 6, fat: 11, servingSize: '1 serving', category: 'Homemade' },
  { name: 'Fattoush Salad', calories: 160, protein: 4, carbs: 20, fat: 8, servingSize: '1 serving', category: 'Homemade' },

  // Homemade Recipes - Breakfast/Brunch
  { name: 'Shakshuka', calories: 280, protein: 16, carbs: 18, fat: 16, servingSize: '1 serving', category: 'Homemade' },
  { name: 'Eggs Benedict (1 serving)', calories: 440, protein: 22, carbs: 32, fat: 25, servingSize: '1 serving', category: 'Homemade' },
  { name: 'Frittata (1 slice)', calories: 220, protein: 14, carbs: 8, fat: 15, servingSize: '1 slice', category: 'Homemade' },
  { name: 'Dutch Baby Pancake', calories: 320, protein: 10, carbs: 38, fat: 14, servingSize: '1 serving', category: 'Homemade' },
  { name: 'French Toast (2 slices)', calories: 360, protein: 12, carbs: 48, fat: 14, servingSize: '2 slices', category: 'Homemade' },
  { name: 'Pancakes (3 pancakes)', calories: 340, protein: 10, carbs: 52, fat: 10, servingSize: '3 pancakes', category: 'Homemade' },
  { name: 'Eggs Florentine', calories: 380, protein: 20, carbs: 28, fat: 22, servingSize: '1 serving', category: 'Homemade' },

  // Sandwiches - Classic
  { name: 'PB&J (peanut butter & jelly)', calories: 350, protein: 13, carbs: 48, fat: 14, servingSize: '1 sandwich', category: 'Sandwiches' },
  { name: 'Peanut Butter Sandwich', calories: 320, protein: 14, carbs: 38, fat: 16, servingSize: '1 sandwich', category: 'Sandwiches' },
  { name: 'Grilled Cheese', calories: 400, protein: 16, carbs: 36, fat: 22, servingSize: '1 sandwich', category: 'Sandwiches' },
  { name: 'BLT (bacon, lettuce, tomato)', calories: 380, protein: 14, carbs: 34, fat: 22, servingSize: '1 sandwich', category: 'Sandwiches' },
  { name: 'Club Sandwich', calories: 500, protein: 30, carbs: 42, fat: 24, servingSize: '1 sandwich', category: 'Sandwiches' },
  { name: 'Ham and Cheese', calories: 360, protein: 20, carbs: 36, fat: 16, servingSize: '1 sandwich', category: 'Sandwiches' },
  { name: 'Turkey Sandwich', calories: 320, protein: 22, carbs: 38, fat: 10, servingSize: '1 sandwich', category: 'Sandwiches' },
  { name: 'Turkey and Avocado', calories: 420, protein: 24, carbs: 40, fat: 20, servingSize: '1 sandwich', category: 'Sandwiches' },
  { name: 'Roast Beef Sandwich', calories: 400, protein: 26, carbs: 38, fat: 16, servingSize: '1 sandwich', category: 'Sandwiches' },

  // Sandwiches - Salad-Based
  { name: 'Tuna Salad Sandwich', calories: 420, protein: 24, carbs: 36, fat: 20, servingSize: '1 sandwich', category: 'Sandwiches' },
  { name: 'Chicken Salad Sandwich', calories: 450, protein: 22, carbs: 38, fat: 24, servingSize: '1 sandwich', category: 'Sandwiches' },
  { name: 'Egg Salad Sandwich', calories: 380, protein: 16, carbs: 36, fat: 20, servingSize: '1 sandwich', category: 'Sandwiches' },

  // Sandwiches - Hot/Grilled
  { name: 'Reuben Sandwich', calories: 560, protein: 28, carbs: 42, fat: 32, servingSize: '1 sandwich', category: 'Sandwiches' },
  { name: 'Philly Cheesesteak', calories: 550, protein: 32, carbs: 45, fat: 26, servingSize: '1 sandwich', category: 'Sandwiches' },
  { name: 'Meatball Sub', calories: 580, protein: 28, carbs: 52, fat: 28, servingSize: '1 sub', category: 'Sandwiches' },
  { name: 'Italian Sub', calories: 520, protein: 26, carbs: 48, fat: 26, servingSize: '1 sub', category: 'Sandwiches' },
  { name: 'Cuban Sandwich', calories: 480, protein: 30, carbs: 42, fat: 20, servingSize: '1 sandwich', category: 'Sandwiches' },
  { name: 'Patty Melt', calories: 620, protein: 34, carbs: 38, fat: 36, servingSize: '1 sandwich', category: 'Sandwiches' },
  { name: 'French Dip', calories: 500, protein: 32, carbs: 44, fat: 20, servingSize: '1 sandwich', category: 'Sandwiches' },
  { name: 'Pulled Pork Sandwich', calories: 460, protein: 28, carbs: 42, fat: 18, servingSize: '1 sandwich', category: 'Sandwiches' },
  { name: 'Chicken Parm Sandwich', calories: 580, protein: 36, carbs: 48, fat: 26, servingSize: '1 sandwich', category: 'Sandwiches' },

  // Sandwiches - Breakfast
  { name: 'Bacon, Egg, and Cheese', calories: 450, protein: 22, carbs: 32, fat: 26, servingSize: '1 sandwich', category: 'Sandwiches' },
  { name: 'Sausage, Egg, and Cheese', calories: 500, protein: 24, carbs: 34, fat: 30, servingSize: '1 sandwich', category: 'Sandwiches' },
  { name: 'Egg and Cheese', calories: 380, protein: 18, carbs: 32, fat: 20, servingSize: '1 sandwich', category: 'Sandwiches' },

  // Sandwiches - Vegetarian
  { name: 'Veggie Sandwich', calories: 280, protein: 10, carbs: 42, fat: 10, servingSize: '1 sandwich', category: 'Sandwiches' },
  { name: 'Caprese Sandwich', calories: 380, protein: 16, carbs: 38, fat: 18, servingSize: '1 sandwich', category: 'Sandwiches' },
  { name: 'Hummus and Veggie Wrap', calories: 320, protein: 12, carbs: 46, fat: 12, servingSize: '1 wrap', category: 'Sandwiches' },
  { name: 'Falafel Wrap', calories: 420, protein: 14, carbs: 52, fat: 18, servingSize: '1 wrap', category: 'Sandwiches' },

  // Sandwiches - Paninis & Wraps
  { name: 'Chicken Panini', calories: 480, protein: 32, carbs: 40, fat: 20, servingSize: '1 panini', category: 'Sandwiches' },
  { name: 'Turkey Panini', calories: 450, protein: 28, carbs: 42, fat: 18, servingSize: '1 panini', category: 'Sandwiches' },
  { name: 'Chicken Caesar Wrap', calories: 480, protein: 28, carbs: 42, fat: 22, servingSize: '1 wrap', category: 'Sandwiches' },
  { name: 'Buffalo Chicken Wrap', calories: 520, protein: 30, carbs: 44, fat: 24, servingSize: '1 wrap', category: 'Sandwiches' },

  // Desserts - Cookies & Bars
  { name: 'Chocolate Chip Cookie (1 cookie)', calories: 140, protein: 2, carbs: 18, fat: 7, servingSize: '1 cookie (30g)', category: 'Desserts' },
  { name: 'Oatmeal Cookie (1 cookie)', calories: 120, protein: 2, carbs: 17, fat: 5, servingSize: '1 cookie (28g)', category: 'Desserts' },
  { name: 'Peanut Butter Cookie (1 cookie)', calories: 150, protein: 3, carbs: 16, fat: 8, servingSize: '1 cookie (30g)', category: 'Desserts' },
  { name: 'Sugar Cookie (1 cookie)', calories: 130, protein: 1, carbs: 18, fat: 6, servingSize: '1 cookie (28g)', category: 'Desserts' },
  { name: 'Oreo Cookies (3 cookies)', calories: 160, protein: 2, carbs: 25, fat: 7, servingSize: '3 cookies', category: 'Desserts' },
  { name: 'Brownie (1 square)', calories: 220, protein: 3, carbs: 30, fat: 10, servingSize: '1 brownie (60g)', category: 'Desserts' },
  { name: 'Blondie (1 square)', calories: 230, protein: 3, carbs: 32, fat: 11, servingSize: '1 blondie (60g)', category: 'Desserts' },
  { name: 'Rice Krispies Treat (1 bar)', calories: 160, protein: 1, carbs: 32, fat: 3, servingSize: '1 bar (40g)', category: 'Desserts' },

  // Desserts - Cakes & Pastries
  { name: 'Chocolate Cake (1 slice)', calories: 340, protein: 4, carbs: 52, fat: 14, servingSize: '1 slice (100g)', category: 'Desserts' },
  { name: 'Vanilla Cake (1 slice)', calories: 310, protein: 4, carbs: 48, fat: 12, servingSize: '1 slice (95g)', category: 'Desserts' },
  { name: 'Carrot Cake (1 slice)', calories: 360, protein: 4, carbs: 50, fat: 16, servingSize: '1 slice (110g)', category: 'Desserts' },
  { name: 'Red Velvet Cake (1 slice)', calories: 330, protein: 4, carbs: 48, fat: 14, servingSize: '1 slice (100g)', category: 'Desserts' },
  { name: 'Cheesecake (1 slice)', calories: 410, protein: 7, carbs: 32, fat: 29, servingSize: '1 slice (125g)', category: 'Desserts' },
  { name: 'Cupcake (with frosting)', calories: 240, protein: 2, carbs: 36, fat: 10, servingSize: '1 cupcake', category: 'Desserts' },
  { name: 'Donut (glazed)', calories: 260, protein: 3, carbs: 31, fat: 14, servingSize: '1 donut', category: 'Desserts' },
  { name: 'Donut (chocolate)', calories: 280, protein: 3, carbs: 33, fat: 15, servingSize: '1 donut', category: 'Desserts' },
  { name: 'Cinnamon Roll', calories: 420, protein: 7, carbs: 58, fat: 18, servingSize: '1 roll', category: 'Desserts' },
  { name: 'Danish Pastry', calories: 340, protein: 5, carbs: 42, fat: 17, servingSize: '1 pastry', category: 'Desserts' },
  { name: 'Eclair', calories: 290, protein: 6, carbs: 28, fat: 16, servingSize: '1 eclair', category: 'Desserts' },

  // Desserts - Pies & Tarts
  { name: 'Apple Pie (1 slice)', calories: 320, protein: 3, carbs: 48, fat: 14, servingSize: '1 slice (125g)', category: 'Desserts' },
  { name: 'Pumpkin Pie (1 slice)', calories: 280, protein: 5, carbs: 36, fat: 13, servingSize: '1 slice (125g)', category: 'Desserts' },
  { name: 'Pecan Pie (1 slice)', calories: 500, protein: 6, carbs: 64, fat: 26, servingSize: '1 slice (125g)', category: 'Desserts' },
  { name: 'Cherry Pie (1 slice)', calories: 330, protein: 3, carbs: 50, fat: 14, servingSize: '1 slice (125g)', category: 'Desserts' },
  { name: 'Key Lime Pie (1 slice)', calories: 360, protein: 5, carbs: 42, fat: 19, servingSize: '1 slice (125g)', category: 'Desserts' },
  { name: 'Lemon Tart (1 slice)', calories: 290, protein: 4, carbs: 38, fat: 14, servingSize: '1 slice (100g)', category: 'Desserts' },

  // Desserts - Ice Cream & Frozen
  { name: 'Ice Cream (vanilla, 1/2 cup)', calories: 140, protein: 2, carbs: 17, fat: 7, servingSize: '1/2 cup', category: 'Desserts' },
  { name: 'Ice Cream (chocolate, 1/2 cup)', calories: 150, protein: 3, carbs: 19, fat: 8, servingSize: '1/2 cup', category: 'Desserts' },
  { name: 'Gelato (1/2 cup)', calories: 180, protein: 4, carbs: 24, fat: 8, servingSize: '1/2 cup', category: 'Desserts' },
  { name: 'Frozen Yogurt (1/2 cup)', calories: 110, protein: 3, carbs: 19, fat: 3, servingSize: '1/2 cup', category: 'Desserts' },
  { name: 'Ice Cream Sandwich', calories: 240, protein: 4, carbs: 36, fat: 9, servingSize: '1 sandwich', category: 'Desserts' },
  { name: 'Popsicle', calories: 45, protein: 0, carbs: 11, fat: 0, servingSize: '1 popsicle', category: 'Desserts' },
  { name: 'Fudgesicle', calories: 90, protein: 2, carbs: 14, fat: 3, servingSize: '1 bar', category: 'Desserts' },

  // Desserts - Puddings & Mousses
  { name: 'Chocolate Pudding (1/2 cup)', calories: 150, protein: 4, carbs: 24, fat: 5, servingSize: '1/2 cup', category: 'Desserts' },
  { name: 'Vanilla Pudding (1/2 cup)', calories: 140, protein: 4, carbs: 23, fat: 4, servingSize: '1/2 cup', category: 'Desserts' },
  { name: 'Chocolate Mousse (1/2 cup)', calories: 190, protein: 3, carbs: 18, fat: 12, servingSize: '1/2 cup', category: 'Desserts' },
  { name: 'Tiramisu (1 slice)', calories: 350, protein: 6, carbs: 32, fat: 22, servingSize: '1 slice', category: 'Desserts' },
  { name: 'Creme Brulee', calories: 280, protein: 5, carbs: 24, fat: 18, servingSize: '1 serving', category: 'Desserts' },
  { name: 'Panna Cotta', calories: 240, protein: 4, carbs: 20, fat: 16, servingSize: '1 serving', category: 'Desserts' },

  // Desserts - Candy & Chocolate
  { name: 'Chocolate Bar (milk chocolate)', calories: 220, protein: 3, carbs: 26, fat: 13, servingSize: '1.5 oz bar', category: 'Desserts' },
  { name: 'Dark Chocolate (1 oz)', calories: 170, protein: 2, carbs: 13, fat: 12, servingSize: '1 oz (28g)', category: 'Desserts' },
  { name: 'Snickers Bar', calories: 250, protein: 4, carbs: 33, fat: 12, servingSize: '1.86 oz bar', category: 'Desserts' },
  { name: 'Reese\'s Peanut Butter Cups (2 cups)', calories: 210, protein: 5, carbs: 24, fat: 13, servingSize: '2 cups', category: 'Desserts' },
  { name: 'M&Ms (1.69 oz bag)', calories: 240, protein: 2, carbs: 34, fat: 10, servingSize: '1 bag', category: 'Desserts' },
  { name: 'Skittles (2.17 oz bag)', calories: 230, protein: 0, carbs: 56, fat: 2, servingSize: '1 bag', category: 'Desserts' },
  { name: 'Gummy Bears (10 bears)', calories: 85, protein: 2, carbs: 22, fat: 0, servingSize: '10 bears', category: 'Desserts' },

  // Snacks - Chips & Crisps
  { name: 'Potato Chips (1 oz)', calories: 150, protein: 2, carbs: 15, fat: 10, servingSize: '1 oz (28g)', category: 'Snacks' },
  { name: 'Tortilla Chips (1 oz)', calories: 140, protein: 2, carbs: 18, fat: 7, servingSize: '1 oz (28g)', category: 'Snacks' },
  { name: 'Doritos (1 oz)', calories: 150, protein: 2, carbs: 18, fat: 8, servingSize: '1 oz (28g)', category: 'Snacks' },
  { name: 'Pringles (15 chips)', calories: 150, protein: 1, carbs: 15, fat: 9, servingSize: '15 chips', category: 'Snacks' },
  { name: 'Cheetos (1 oz)', calories: 160, protein: 2, carbs: 15, fat: 10, servingSize: '1 oz (28g)', category: 'Snacks' },
  { name: 'Sun Chips (1 oz)', calories: 140, protein: 2, carbs: 19, fat: 6, servingSize: '1 oz (28g)', category: 'Snacks' },
  { name: 'Veggie Straws (1 oz)', calories: 130, protein: 1, carbs: 17, fat: 7, servingSize: '1 oz (28g)', category: 'Snacks' },
  { name: 'Popcorn (air-popped, 3 cups)', calories: 93, protein: 3, carbs: 18, fat: 1, servingSize: '3 cups', category: 'Snacks' },
  { name: 'Popcorn (buttered, 3 cups)', calories: 180, protein: 3, carbs: 20, fat: 10, servingSize: '3 cups', category: 'Snacks' },

  // Snacks - Crackers & Pretzels
  { name: 'Saltine Crackers (5 crackers)', calories: 60, protein: 1, carbs: 11, fat: 1.5, servingSize: '5 crackers', category: 'Snacks' },
  { name: 'Wheat Thins (16 crackers)', calories: 140, protein: 2, carbs: 22, fat: 5, servingSize: '16 crackers', category: 'Snacks' },
  { name: 'Ritz Crackers (5 crackers)', calories: 80, protein: 1, carbs: 10, fat: 4, servingSize: '5 crackers', category: 'Snacks' },
  { name: 'Triscuits (6 crackers)', calories: 120, protein: 3, carbs: 20, fat: 4, servingSize: '6 crackers', category: 'Snacks' },
  { name: 'Pretzels (1 oz)', calories: 110, protein: 3, carbs: 23, fat: 1, servingSize: '1 oz (28g)', category: 'Snacks' },
  { name: 'Goldfish Crackers (55 pieces)', calories: 140, protein: 3, carbs: 20, fat: 5, servingSize: '55 pieces', category: 'Snacks' },

  // Snacks - Nuts & Trail Mix
  { name: 'Mixed Nuts (1 oz)', calories: 170, protein: 5, carbs: 6, fat: 15, servingSize: '1 oz (28g)', category: 'Snacks' },
  { name: 'Cashews (1 oz, ~18 nuts)', calories: 157, protein: 5, carbs: 9, fat: 12, servingSize: '1 oz / 18 cashews (28g)', category: 'Snacks' },
  { name: 'Cashews (1/4 cup)', calories: 197, protein: 6, carbs: 11, fat: 16, servingSize: '1/4 cup (34g)', category: 'Snacks' },
  { name: 'Pistachios (1 oz, ~49 nuts)', calories: 159, protein: 6, carbs: 8, fat: 13, servingSize: '1 oz / 49 pistachios (28g)', category: 'Snacks' },
  { name: 'Pistachios (1/4 cup)', calories: 170, protein: 6, carbs: 8, fat: 14, servingSize: '1/4 cup (30g)', category: 'Snacks' },
  { name: 'Trail Mix (1/4 cup)', calories: 140, protein: 4, carbs: 16, fat: 8, servingSize: '1/4 cup (38g)', category: 'Snacks' },
  { name: 'Sunflower Seeds (1 oz)', calories: 165, protein: 6, carbs: 7, fat: 14, servingSize: '1 oz (28g)', category: 'Snacks' },
  { name: 'Pumpkin Seeds (1 oz)', calories: 151, protein: 7, carbs: 5, fat: 13, servingSize: '1 oz (28g)', category: 'Snacks' },

  // Snacks - Granola & Bars
  { name: 'Granola Bar (chewy)', calories: 120, protein: 2, carbs: 20, fat: 4, servingSize: '1 bar (28g)', category: 'Snacks' },
  { name: 'Nature Valley Bar (crunchy)', calories: 190, protein: 4, carbs: 29, fat: 7, servingSize: '2 bars', category: 'Snacks' },
  { name: 'Clif Bar', calories: 250, protein: 9, carbs: 45, fat: 5, servingSize: '1 bar (68g)', category: 'Snacks' },
  { name: 'Kind Bar', calories: 200, protein: 6, carbs: 17, fat: 13, servingSize: '1 bar (40g)', category: 'Snacks' },
  { name: 'Granola (1/2 cup)', calories: 220, protein: 5, carbs: 38, fat: 6, servingSize: '1/2 cup', category: 'Snacks' },

  // Snacks - Other
  { name: 'String Cheese (1 stick)', calories: 80, protein: 7, carbs: 1, fat: 6, servingSize: '1 stick (28g)', category: 'Snacks' },
  { name: 'Beef Jerky (1 oz)', calories: 116, protein: 9, carbs: 3, fat: 7, servingSize: '1 oz (28g)', category: 'Snacks' },
  { name: 'Rice Cakes (1 cake)', calories: 35, protein: 1, carbs: 7, fat: 0.3, servingSize: '1 cake', category: 'Snacks' },
  { name: 'Apple with Peanut Butter (2 tbsp)', calories: 285, protein: 8, carbs: 33, fat: 16, servingSize: '1 apple + 2 tbsp PB', category: 'Snacks' },
  { name: 'Celery with Peanut Butter (2 tbsp)', calories: 200, protein: 8, carbs: 12, fat: 16, servingSize: '2 stalks + 2 tbsp PB', category: 'Snacks' },
  { name: 'Hummus with Veggies', calories: 120, protein: 5, carbs: 14, fat: 6, servingSize: '1/4 cup hummus + veggies', category: 'Snacks' },
  { name: 'Cheese and Crackers', calories: 200, protein: 8, carbs: 18, fat: 11, servingSize: '1 serving', category: 'Snacks' },
  { name: 'Fruit Cup', calories: 80, protein: 1, carbs: 20, fat: 0, servingSize: '1 cup', category: 'Snacks' },
  { name: 'Applesauce (unsweetened, 1 cup)', calories: 100, protein: 0, carbs: 26, fat: 0, servingSize: '1 cup', category: 'Snacks' },

  // More Vegetables
  { name: 'Broccoli (cooked)', calories: 55, protein: 3.7, carbs: 11, fat: 0.6, servingSize: '1 cup (156g)', category: 'Snacks' },
  { name: 'Cauliflower (cooked)', calories: 29, protein: 2.3, carbs: 5.7, fat: 0.6, servingSize: '1 cup (124g)', category: 'Snacks' },
  { name: 'Green Beans (cooked)', calories: 44, protein: 2.4, carbs: 10, fat: 0.4, servingSize: '1 cup (125g)', category: 'Snacks' },
  { name: 'Asparagus (cooked)', calories: 40, protein: 4.3, carbs: 7.6, fat: 0.4, servingSize: '1 cup (180g)', category: 'Snacks' },
  { name: 'Brussels Sprouts (cooked)', calories: 56, protein: 4, carbs: 11, fat: 0.8, servingSize: '1 cup (156g)', category: 'Snacks' },
  { name: 'Spinach (cooked)', calories: 41, protein: 5, carbs: 7, fat: 0.5, servingSize: '1 cup (180g)', category: 'Snacks' },
  { name: 'Kale (cooked)', calories: 36, protein: 2.5, carbs: 7, fat: 0.5, servingSize: '1 cup (130g)', category: 'Snacks' },
  { name: 'Bell Pepper (raw)', calories: 30, protein: 1, carbs: 7, fat: 0.2, servingSize: '1 medium (119g)', category: 'Snacks' },
  { name: 'Zucchini (cooked)', calories: 27, protein: 2, carbs: 7, fat: 0.3, servingSize: '1 cup (180g)', category: 'Snacks' },
  { name: 'Mushrooms (cooked)', calories: 44, protein: 3.4, carbs: 8, fat: 0.7, servingSize: '1 cup (156g)', category: 'Snacks' },
  { name: 'Sweet Potato (baked)', calories: 180, protein: 4, carbs: 41, fat: 0.3, servingSize: '1 medium (150g)', category: 'Snacks' },
  { name: 'Regular Potato (baked)', calories: 163, protein: 4.3, carbs: 37, fat: 0.2, servingSize: '1 medium (173g)', category: 'Snacks' },

  // More Fruits
  { name: 'Mango', calories: 99, protein: 1.4, carbs: 25, fat: 0.6, servingSize: '1 cup (165g)', category: 'Snacks' },
  { name: 'Pineapple', calories: 82, protein: 0.9, carbs: 22, fat: 0.2, servingSize: '1 cup (165g)', category: 'Snacks' },
  { name: 'Kiwi', calories: 61, protein: 1.1, carbs: 15, fat: 0.5, servingSize: '1 fruit (100g)', category: 'Snacks' },
  { name: 'Cantaloupe', calories: 54, protein: 1.3, carbs: 13, fat: 0.3, servingSize: '1 cup (177g)', category: 'Snacks' },
  { name: 'Honeydew Melon', calories: 61, protein: 0.9, carbs: 15, fat: 0.2, servingSize: '1 cup (170g)', category: 'Snacks' },
  { name: 'Peach', calories: 59, protein: 1.4, carbs: 14, fat: 0.4, servingSize: '1 medium (150g)', category: 'Snacks' },
  { name: 'Plum', calories: 46, protein: 0.7, carbs: 11, fat: 0.3, servingSize: '1 fruit (66g)', category: 'Snacks' },

  // Condiments & Sauces
  { name: 'Ketchup (1 tbsp)', calories: 17, protein: 0.2, carbs: 4.5, fat: 0, servingSize: '1 tbsp', category: 'Condiments' },
  { name: 'Mustard (1 tbsp)', calories: 10, protein: 0.6, carbs: 1, fat: 0.6, servingSize: '1 tbsp', category: 'Condiments' },
  { name: 'Mayonnaise (1 tbsp)', calories: 94, protein: 0.1, carbs: 0.1, fat: 10, servingSize: '1 tbsp', category: 'Condiments' },
  { name: 'Ranch Dressing (2 tbsp)', calories: 145, protein: 0.5, carbs: 2, fat: 15, servingSize: '2 tbsp', category: 'Condiments' },
  { name: 'Caesar Dressing (2 tbsp)', calories: 160, protein: 1, carbs: 1, fat: 17, servingSize: '2 tbsp', category: 'Condiments' },
  { name: 'Italian Dressing (2 tbsp)', calories: 80, protein: 0, carbs: 3, fat: 7, servingSize: '2 tbsp', category: 'Condiments' },
  { name: 'Balsamic Vinaigrette (2 tbsp)', calories: 90, protein: 0, carbs: 4, fat: 8, servingSize: '2 tbsp', category: 'Condiments' },
  { name: 'Thousand Island (2 tbsp)', calories: 120, protein: 0.3, carbs: 5, fat: 11, servingSize: '2 tbsp', category: 'Condiments' },
  { name: 'BBQ Sauce (2 tbsp)', calories: 60, protein: 0.5, carbs: 14, fat: 0.5, servingSize: '2 tbsp', category: 'Condiments' },
  { name: 'Hot Sauce (1 tbsp)', calories: 5, protein: 0.2, carbs: 1, fat: 0, servingSize: '1 tbsp', category: 'Condiments' },
  { name: 'Soy Sauce (1 tbsp)', calories: 9, protein: 1.3, carbs: 0.8, fat: 0, servingSize: '1 tbsp', category: 'Condiments' },
  { name: 'Teriyaki Sauce (1 tbsp)', calories: 16, protein: 0.5, carbs: 3, fat: 0, servingSize: '1 tbsp', category: 'Condiments' },
  { name: 'Sriracha (1 tsp)', calories: 5, protein: 0.1, carbs: 1, fat: 0, servingSize: '1 tsp', category: 'Condiments' },
  { name: 'Honey (1 tbsp)', calories: 64, protein: 0.1, carbs: 17, fat: 0, servingSize: '1 tbsp', category: 'Condiments' },
  { name: 'Maple Syrup (1 tbsp)', calories: 52, protein: 0, carbs: 13, fat: 0, servingSize: '1 tbsp', category: 'Condiments' },
  { name: 'Butter (1 tbsp)', calories: 102, protein: 0.1, carbs: 0, fat: 11.5, servingSize: '1 tbsp', category: 'Condiments' },
  { name: 'Olive Oil (1 tbsp)', calories: 119, protein: 0, carbs: 0, fat: 13.5, servingSize: '1 tbsp', category: 'Condiments' },

  // Smoothies & Drinks
  { name: 'Protein Shake (whey, 1 scoop)', calories: 120, protein: 24, carbs: 3, fat: 1.5, servingSize: '1 scoop (30g)', category: 'Drinks' },
  { name: 'Green Smoothie', calories: 180, protein: 4, carbs: 38, fat: 2, servingSize: '16 oz', category: 'Drinks' },
  { name: 'Fruit Smoothie', calories: 220, protein: 3, carbs: 52, fat: 1.5, servingSize: '16 oz', category: 'Drinks' },
  { name: 'Protein Smoothie', calories: 280, protein: 25, carbs: 32, fat: 6, servingSize: '16 oz', category: 'Drinks' },
  { name: 'Lemonade (8 oz)', calories: 99, protein: 0, carbs: 26, fat: 0, servingSize: '8 oz', category: 'Drinks' },
  { name: 'Iced Tea (unsweetened, 8 oz)', calories: 2, protein: 0, carbs: 0.5, fat: 0, servingSize: '8 oz', category: 'Drinks' },
  { name: 'Sweet Tea (8 oz)', calories: 90, protein: 0, carbs: 24, fat: 0, servingSize: '8 oz', category: 'Drinks' },

  // More Breakfast Items
  { name: 'Avocado Toast', calories: 280, protein: 8, carbs: 28, fat: 16, servingSize: '1 slice', category: 'Breakfast' },
  { name: 'Breakfast Burrito', calories: 520, protein: 24, carbs: 48, fat: 26, servingSize: '1 burrito', category: 'Breakfast' },
  { name: 'Yogurt Parfait', calories: 220, protein: 12, carbs: 38, fat: 3, servingSize: '1 cup', category: 'Breakfast' },
  { name: 'Breakfast Bowl', calories: 380, protein: 18, carbs: 42, fat: 16, servingSize: '1 bowl', category: 'Breakfast' },
  { name: 'Acai Bowl', calories: 320, protein: 6, carbs: 58, fat: 8, servingSize: '1 bowl', category: 'Breakfast' },
];

// Toppings for sandwiches and burgers
export const sandwichToppings = [
  // Proteins
  { name: 'Bacon (2 strips)', calories: 90, protein: 6, carbs: 0, fat: 7, category: 'protein' },
  { name: 'Fried Egg', calories: 90, protein: 6, carbs: 0.5, fat: 7, category: 'protein' },
  { name: 'Ham', calories: 60, protein: 10, carbs: 1, fat: 2, category: 'protein' },
  { name: 'Turkey', calories: 50, protein: 10, carbs: 1, fat: 0.5, category: 'protein' },
  { name: 'Grilled Chicken', calories: 110, protein: 22, carbs: 0, fat: 2, category: 'protein' },
  { name: 'Extra Beef Patty', calories: 220, protein: 20, carbs: 0, fat: 15, category: 'protein' },

  // Cheese
  { name: 'American Cheese', calories: 96, protein: 5, carbs: 2, fat: 7, category: 'cheese' },
  { name: 'Cheddar Cheese', calories: 113, protein: 7, carbs: 0.4, fat: 9.3, category: 'cheese' },
  { name: 'Swiss Cheese', calories: 106, protein: 8, carbs: 1.5, fat: 8, category: 'cheese' },
  { name: 'Provolone', calories: 98, protein: 7, carbs: 0.6, fat: 7.5, category: 'cheese' },
  { name: 'Pepper Jack', calories: 110, protein: 6.5, carbs: 0.5, fat: 9, category: 'cheese' },
  { name: 'Mozzarella', calories: 85, protein: 6, carbs: 1, fat: 6, category: 'cheese' },

  // Vegetables
  { name: 'Lettuce', calories: 5, protein: 0.5, carbs: 1, fat: 0, category: 'vegetable' },
  { name: 'Tomato', calories: 10, protein: 0.5, carbs: 2, fat: 0, category: 'vegetable' },
  { name: 'Onion', calories: 12, protein: 0.3, carbs: 3, fat: 0, category: 'vegetable' },
  { name: 'Pickles', calories: 5, protein: 0.2, carbs: 1, fat: 0, category: 'vegetable' },
  { name: 'Jalapeños', calories: 5, protein: 0.2, carbs: 1, fat: 0, category: 'vegetable' },
  { name: 'Avocado', calories: 120, protein: 1.5, carbs: 6, fat: 11, category: 'vegetable' },
  { name: 'Mushrooms (sautéed)', calories: 28, protein: 2, carbs: 4, fat: 0.5, category: 'vegetable' },
  { name: 'Bell Peppers', calories: 10, protein: 0.3, carbs: 2, fat: 0, category: 'vegetable' },
  { name: 'Spinach', calories: 5, protein: 0.5, carbs: 1, fat: 0, category: 'vegetable' },

  // Condiments & Sauces (common burger/sandwich additions)
  { name: 'Ketchup', calories: 17, protein: 0.2, carbs: 4.5, fat: 0, category: 'sauce' },
  { name: 'Mustard', calories: 10, protein: 0.6, carbs: 1, fat: 0.6, category: 'sauce' },
  { name: 'Mayo', calories: 94, protein: 0.1, carbs: 0.1, fat: 10, category: 'sauce' },
  { name: 'Ranch', calories: 73, protein: 0.3, carbs: 1, fat: 7.5, category: 'sauce' },
  { name: 'BBQ Sauce', calories: 30, protein: 0.3, carbs: 7, fat: 0.3, category: 'sauce' },
  { name: 'Hot Sauce', calories: 5, protein: 0.2, carbs: 1, fat: 0, category: 'sauce' },
  { name: 'Chipotle Mayo', calories: 100, protein: 0.2, carbs: 1, fat: 11, category: 'sauce' },
  { name: 'Honey Mustard', calories: 50, protein: 0.3, carbs: 5, fat: 3.5, category: 'sauce' },
];

// Mark which foods support toppings
export const foodsWithToppings = [
  'Hamburger (fast food)',
  'Cheeseburger (fast food)',
  'Double Cheeseburger',
  'Grilled Cheese',
  'BLT (bacon, lettuce, tomato)',
  'Club Sandwich',
  'Ham and Cheese',
  'Turkey Sandwich',
  'Turkey and Avocado',
  'Roast Beef Sandwich',
  'Tuna Salad Sandwich',
  'Chicken Salad Sandwich',
  'Egg Salad Sandwich',
  'Reuben Sandwich',
  'Philly Cheesesteak',
  'Patty Melt',
  'Pulled Pork Sandwich',
  'Bacon, Egg, and Cheese',
  'Sausage, Egg, and Cheese',
  'Egg and Cheese',
  'Veggie Sandwich',
  'Chicken Sandwich (grilled)',
  'Chicken Sandwich (fried)',
];

// Helper to check if food supports toppings
export function supportsToppings(foodName) {
  return foodsWithToppings.includes(foodName);
}

// Improved search function with flexible word matching
export function searchCommonFoods(query) {
  if (!query || query.trim().length < 2) {
    return commonFoods;
  }

  const searchTerm = query.toLowerCase().trim();

  // Split search into words for better matching
  const searchWords = searchTerm.split(/\s+/);

  return commonFoods.filter(food => {
    const foodName = food.name.toLowerCase();
    const foodCategory = food.category.toLowerCase();

    // Check if search term is in name or category (original behavior)
    if (foodName.includes(searchTerm) || foodCategory.includes(searchTerm)) {
      return true;
    }

    // Check if all search words appear anywhere in the food name (flexible matching)
    // This allows "whole milk" to match "Milk (whole)"
    const allWordsMatch = searchWords.every(word =>
      foodName.includes(word) || foodCategory.includes(word)
    );

    return allWordsMatch;
  });
}

// Get foods by category
export function getFoodsByCategory(category) {
  if (!category) {
    return commonFoods;
  }

  return commonFoods.filter(food => food.category === category);
}

// Get all categories
export function getCategories() {
  const categories = [...new Set(commonFoods.map(food => food.category))];
  return categories.sort();
}
