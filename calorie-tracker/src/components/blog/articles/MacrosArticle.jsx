import BlogLayout from '../BlogLayout';
import SEO from '../../SEO';
import { Link } from 'react-router-dom';

export default function MacrosArticle() {
  return (
    <BlogLayout>
      <SEO
        title="What Are Macros? Understanding Macronutrients"
        description="Learn what macronutrients (protein, carbs, and fat) are, what they do in your body, and why tracking them matters."
        keywords={['what are macros', 'macronutrients explained', 'protein carbs fat', 'why track macros']}
        url="/blog/what-are-macros"
        image="https://freecalorietrack.com/images/blog/macros-guide.webp"
      />
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        <Link to="/blog" className="hover:text-emerald-600 dark:hover:text-emerald-400">Blog</Link>
        {' > '}
        <span>Guides</span>
      </div>

      {/* Hero Image */}
      <div className="w-full aspect-video rounded-xl overflow-hidden mb-8 shadow-lg">
        <img
          src="/images/blog/macros-guide.webp"
          alt="What are macros guide"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Article Header */}
      <article className="prose prose-lg dark:prose-invert max-w-none">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8"
            style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
          What Are Macros? Understanding Macronutrients
        </h1>

        {/* TL;DR */}
        <div className="bg-emerald-50 dark:bg-emerald-900/20 border-l-4 border-emerald-500 p-6 my-8 rounded-r-lg">
          <h3 className="text-lg font-bold text-emerald-900 dark:text-emerald-100 mt-0 mb-3">
            💡 TL;DR
          </h3>
          <ul className="mb-0 list-disc ml-6 space-y-2 text-gray-800 dark:text-gray-200">
            <li>Macros (macronutrients) are protein, carbohydrates, and fat—the three nutrients that provide calories</li>
            <li>Each macro has specific roles in your body (muscle building, energy, hormones)</li>
            <li>Tracking macros ensures you eat the right balance for your goals, not just hitting a calorie number</li>
            <li>Calories determine weight change; macros determine body composition</li>
          </ul>
        </div>

        {/* Article Content */}
        <h2 className="text-2xl font-bold mt-8 mb-4">What Are Macronutrients?</h2>

        <p>
          <strong>Macronutrients</strong> (macros) are the three types of nutrients your body needs in large amounts to function. Unlike micronutrients (vitamins and minerals, needed in small amounts), macros make up the bulk of your diet and provide all your calories.
        </p>

        <p>
          The three macronutrients are:
        </p>

        <div className="grid md:grid-cols-3 gap-4 my-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h3 className="text-blue-700 dark:text-blue-400 font-bold mt-0 mb-2">Protein</h3>
            <p className="text-sm mb-2"><strong>4 calories per gram</strong></p>
            <p className="text-xs mb-0">Builds and repairs muscle, supports immune function, makes enzymes and hormones</p>
          </div>
          <div className="bg-orange-50 dark:bg-orange-900/20 border-2 border-orange-200 dark:border-orange-800 rounded-lg p-4">
            <h3 className="text-orange-700 dark:text-orange-400 font-bold mt-0 mb-2">Carbohydrates</h3>
            <p className="text-sm mb-2"><strong>4 calories per gram</strong></p>
            <p className="text-xs mb-0">Primary energy source, fuels brain and muscles, stores as glycogen for workouts</p>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 border-2 border-purple-200 dark:border-purple-800 rounded-lg p-4">
            <h3 className="text-purple-700 dark:text-purple-400 font-bold mt-0 mb-2">Fat</h3>
            <p className="text-sm mb-2"><strong>9 calories per gram</strong></p>
            <p className="text-xs mb-0">Hormone production, vitamin absorption, cell membranes, long-term energy</p>
          </div>
        </div>

        <h2 className="text-2xl font-bold mt-8 mb-4">What Does Each Macro Do?</h2>

        <h3 className="text-xl font-bold mt-6 mb-3">Protein: The Building Block</h3>
        <p>
          Protein is made of amino acids, which are the building blocks your body uses to:
        </p>

        <ul className="list-disc ml-6 space-y-2 my-6">
          <li><strong>Build muscle:</strong> Especially important during strength training or weight loss</li>
          <li><strong>Repair tissue:</strong> Heals injuries, maintains skin, hair, and nails</li>
          <li><strong>Make enzymes and hormones:</strong> Insulin, growth hormone, digestive enzymes</li>
          <li><strong>Support immune function:</strong> Antibodies are made from protein</li>
        </ul>

        <p>
          <strong>Best sources:</strong> Chicken, turkey, beef, fish, eggs, Greek yogurt, tofu, lentils, protein powder
        </p>

        <h3 className="text-xl font-bold mt-6 mb-3">Carbohydrates: Your Body's Fuel</h3>
        <p>
          Carbohydrates break down into glucose (sugar), which your body uses for energy. Carbs are your body's preferred fuel source for:
        </p>

        <ul className="list-disc ml-6 space-y-2 my-6">
          <li><strong>Brain function:</strong> Your brain runs almost entirely on glucose</li>
          <li><strong>Muscle energy:</strong> Stored as glycogen in muscles for workouts</li>
          <li><strong>High-intensity exercise:</strong> Lifting weights, sprinting, HIIT all rely on carbs</li>
          <li><strong>Daily activity:</strong> Walking, thinking, basic movement</li>
        </ul>

        <p>
          <strong>Best sources:</strong> Rice, oats, potatoes, sweet potatoes, bread, pasta, fruit, vegetables
        </p>

        <h3 className="text-xl font-bold mt-6 mb-3">Fat: Essential for Hormones and Health</h3>
        <p>
          Dietary fat is crucial for your body to function properly. Fat is used for:
        </p>

        <ul className="list-disc ml-6 space-y-2 my-6">
          <li><strong>Hormone production:</strong> Testosterone, estrogen, cortisol all require fat</li>
          <li><strong>Vitamin absorption:</strong> Vitamins A, D, E, and K are fat-soluble (you can't absorb them without fat)</li>
          <li><strong>Cell membranes:</strong> Every cell in your body has a fatty outer layer</li>
          <li><strong>Brain health:</strong> 60% of your brain is made of fat</li>
          <li><strong>Satiety:</strong> Fat keeps you full longer than carbs or protein</li>
        </ul>

        <p>
          <strong>Focus on healthy fats:</strong> Not all fats are equal. Prioritize unsaturated fats (olive oil, avocado, nuts, seeds, fatty fish like salmon and mackerel) over saturated fats (butter, cheese, red meat). Trans fats (found in processed foods) should be avoided entirely. While dietary fat is essential, it's also calorie-dense at 9 calories per gram, so portion control matters. A little goes a long way.
        </p>

        <p>
          <strong>Best sources:</strong> Olive oil, avocado, nuts, seeds, fatty fish (salmon, mackerel), egg yolks, natural nut butters
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4">Why Track Macros (Not Just Calories)?</h2>

        <p>
          You can lose weight eating 2,000 <Link to="/blog/what-are-calories" className="text-emerald-600 dark:text-emerald-400 hover:underline">calories</Link> of junk food or 2,000 calories of whole foods. <strong>But your body composition will be completely different.</strong>
        </p>

        <p>
          Here's why macros matter:
        </p>

        <h3 className="text-xl font-bold mt-6 mb-3">1. Protein Preserves Muscle</h3>
        <p>
          When you're in a calorie deficit, your body burns fat <em>and</em> muscle for energy. <a href="https://pubmed.ncbi.nlm.nih.gov/23739654/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 dark:text-emerald-400 hover:underline">High protein intake signals your body to spare muscle and burn mostly fat</a>. If you eat 2,000 calories with only 50g protein, you'll lose muscle and end up "skinny fat." If you eat 2,000 calories with 150g protein, you'll lose mostly fat and look lean.
        </p>

        <h3 className="text-xl font-bold mt-6 mb-3">2. Carbs Fuel Performance</h3>
        <p>
          If you're lifting weights, doing HIIT, or playing sports, you need carbs. Low-carb diets work fine for sedentary people, but active individuals perform better with adequate carbs. No carbs = flat muscles, low energy, poor workouts.
        </p>

        <h3 className="text-xl font-bold mt-6 mb-3">3. Fat Supports Overall Health</h3>
        <p>
          <a href="https://pubmed.ncbi.nlm.nih.gov/8942407/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 dark:text-emerald-400 hover:underline">Research suggests</a> that adequate dietary fat is essential for numerous body functions, including nutrient absorption (vitamins A, D, E, and K), cell structure, brain health, and hormone production. Very low-fat diets may lead to deficiencies and health issues over time. Fat also provides sustained energy and helps you feel full between meals. The key is getting enough fat from healthy sources rather than avoiding it altogether.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4">How Much of Each Macro Do You Need?</h2>

        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 my-6 text-sm text-gray-700 dark:text-gray-300">
          <strong>Important:</strong> These are general guidelines. Individual needs vary based on age, activity level, health conditions, and goals. Always consult with a healthcare provider or registered dietitian before making significant changes to your diet or macronutrient intake.
        </div>

        <p>
          General guidelines for active individuals:
        </p>

        <ul className="list-disc ml-6 space-y-2 my-6">
          <li><strong>Protein:</strong> 0.8-1.2g per pound of body weight (more if losing weight or building muscle)</li>
          <li><strong>Fat:</strong> 0.3-0.5g per pound of body weight (minimum 50g/day for hormones)</li>
          <li><strong>Carbs:</strong> Fill the rest of your calories with carbs</li>
        </ul>

        <p>
          For detailed macro targets based on your goals, use our <Link to="/blog/macro-calculator-guide" className="text-emerald-600 dark:text-emerald-400 hover:underline">macro calculator</Link>.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4">Common Macro Tracking Mistakes</h2>

        <h3 className="text-xl font-bold mt-6 mb-3">Mistake 1: Prioritizing carbs and fat over protein</h3>
        <p>
          Protein is the most important macro for body composition. Hit your protein target first, then fill in carbs and fat. Don't sacrifice protein to fit in more carbs or fat.
        </p>

        <h3 className="text-xl font-bold mt-6 mb-3">Mistake 2: Cutting fat too low</h3>
        <p>
          Fat-free diets sound good but wreck your hormones. Keep fat at least 0.3g/lb of body weight (50-70g/day for most people).
        </p>

        <h3 className="text-xl font-bold mt-6 mb-3">Mistake 3: Obsessing over perfection</h3>
        <p>
          You don't need to hit your macros exactly every day. Aim for weekly averages. If you're within 5-10g of each target most days, you're fine.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4">Track Your Macros with Free Calorie Track</h2>

        <p>
          Free Calorie Track makes macro tracking simple:
        </p>

        <ul className="list-disc ml-6 space-y-2 my-6">
          <li>✅ Set custom macro goals (or use our calculator)</li>
          <li>✅ See real-time progress bars for protein, carbs, and fat</li>
          <li>✅ Barcode scanning pulls accurate macro data</li>
          <li>✅ Quick-add foods and custom recipes</li>
          <li>✅ Track macros alongside calories</li>
          <li>✅ 100% free forever</li>
        </ul>

        <div className="text-center my-8">
          <Link
            to="/"
            className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-8 rounded-xl transition-colors shadow-lg"
            style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
          >
            Start Tracking Macros Free
          </Link>
        </div>

        {/* Related Posts */}
        <div className="border-t border-gray-300 dark:border-gray-700 pt-8 mt-12">
          <h3 className="text-xl font-bold mb-4">Related Articles</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <Link
              to="/blog/what-are-calories"
              className="block p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="text-2xl mb-2">⚡</div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                What Are Calories?
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-0">
                Learn the basics of calorie tracking
              </p>
            </Link>
            <Link
              to="/blog/macro-calculator-guide"
              className="block p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="text-2xl mb-2">🧮</div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                Macro Calculator Guide
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-0">
                Calculate your optimal macro targets
              </p>
            </Link>
          </div>
        </div>
      </article>
    </BlogLayout>
  );
}
