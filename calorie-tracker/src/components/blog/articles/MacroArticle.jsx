import BlogLayout from '../BlogLayout';
import SEO from '../../SEO';
import MacroCalculator from '../MacroCalculator';
import { Link } from 'react-router-dom';

export default function MacroArticle() {
  return (
    <BlogLayout>
      <SEO
        title="Macro Calculator: Find Your Protein, Carbs, and Fat Goals"
        description="Use our free macro calculator to find your optimal protein, carbohydrate, and fat intake based on your goals."
        keywords={['macro calculator', 'how to calculate macros', 'macros for weight loss', 'protein carbs fat ratio']}
        url="/blog/macro-calculator-guide"
        image="https://freecalorietrack.com/images/blog/macro-calculator.webp"
      />
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        <Link to="/blog" className="hover:text-emerald-600 dark:hover:text-emerald-400">Blog</Link>
        {' > '}
        <span>Calculators</span>
      </div>

      {/* Hero Image */}
      <div className="w-full aspect-video rounded-xl overflow-hidden mb-8 shadow-lg">
        <img
          src="/images/blog/macro-calculator.webp"
          alt="Macro calculator guide"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Article Header */}
      <article className="prose prose-lg dark:prose-invert max-w-none">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3"
            style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
          Macro Calculator: Find Your Protein, Carbs, and Fat Goals
        </h1>


        {/* TL;DR */}
        <div className="bg-emerald-50 dark:bg-emerald-900/20 border-l-4 border-emerald-500 p-6 my-8 rounded-r-lg">
          <h3 className="text-lg font-bold text-emerald-900 dark:text-emerald-100 mt-0 mb-3">
            💡 TL;DR
          </h3>
          <ul className="mb-0 space-y-2 text-gray-800 dark:text-gray-200">
            <li><strong>Macronutrients (macros)</strong> are protein, carbohydrates, and fat—the three nutrients that provide calories</li>
            <li>Use the calculator below to find your optimal macro split</li>
            <li>Common splits: Balanced (30/40/30), High Protein (40/30/30), Low Carb (35/20/45)</li>
            <li>Track macros alongside calories for better body composition results</li>
          </ul>
        </div>

        {/* Article Content */}
        <h2 id="what-are-macros" className="text-2xl font-bold mt-8 mb-4">What Are Macros?</h2>
        <p>
          <strong>Macronutrients</strong> (macros) are the three nutrients your body needs in large amounts. Learn more about <Link to="/blog/what-are-macros" className="text-emerald-600 dark:text-emerald-400 hover:underline">what macronutrients are and what they do</Link>.
        </p>

        <div className="grid md:grid-cols-3 gap-4 my-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h3 className="text-blue-700 dark:text-blue-400 font-bold mt-0 mb-2">Protein</h3>
            <p className="text-sm mb-2"><strong>4 calories per gram</strong></p>
            <p className="text-xs mb-0">Builds muscle, repairs tissue, supports immune function</p>
          </div>
          <div className="bg-orange-50 dark:bg-orange-900/20 border-2 border-orange-200 dark:border-orange-800 rounded-lg p-4">
            <h3 className="text-orange-700 dark:text-orange-400 font-bold mt-0 mb-2">Carbohydrates</h3>
            <p className="text-sm mb-2"><strong>4 calories per gram</strong></p>
            <p className="text-xs mb-0">Primary energy source, fuels workouts and brain function</p>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 border-2 border-purple-200 dark:border-purple-800 rounded-lg p-4">
            <h3 className="text-purple-700 dark:text-purple-400 font-bold mt-0 mb-2">Fat</h3>
            <p className="text-sm mb-2"><strong>9 calories per gram</strong></p>
            <p className="text-xs mb-0">Hormone production, vitamin absorption, sustained energy</p>
          </div>
        </div>

        <h2 id="why-track-macros" className="text-2xl font-bold mt-8 mb-4">Why Track Macros (Not Just Calories)?</h2>
        <p>
          You can lose weight eating 2,000 calories of pizza or 2,000 calories of chicken and vegetables. <strong>But your body composition will be completely different.</strong>
        </p>

        <p>
          Tracking macros ensures you're eating enough:
        </p>
        <ul className="list-disc ml-6 space-y-2 my-6">
          <li><strong>Protein</strong> to preserve muscle mass while losing fat</li>
          <li><strong>Carbs</strong> to fuel workouts and recovery</li>
          <li><strong>Fat</strong> for hormones, brain health, and satiety</li>
        </ul>

        <p>
          <em>Calories determine weight change. Macros determine body composition.</em>
        </p>

        <h2 id="macro-splits" className="text-2xl font-bold mt-8 mb-4">Common Macro Splits</h2>

        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 my-6 text-sm text-gray-700 dark:text-gray-300">
          <strong>Important:</strong> These macro splits are general guidelines. Individual needs vary based on activity level, goals, body composition, and health conditions. What works for one person may not work for another. Consider consulting with a registered dietitian for personalized macro recommendations.
        </div>

        <h3 className="text-xl font-bold mt-6 mb-3">Balanced (30% Protein, 40% Carbs, 30% Fat)</h3>
        <p>
          <strong>Best for:</strong> General health, maintenance, beginners
        </p>
        <p>
          A well-rounded split that works for most people. Enough protein to support muscle, enough carbs for energy, enough fat for hormones.
        </p>

        <h3 className="text-xl font-bold mt-6 mb-3">High Protein (40% Protein, 30% Carbs, 30% Fat)</h3>
        <p>
          <strong>Best for:</strong> Fat loss, muscle gain, active individuals
        </p>
        <p>
          Higher protein helps preserve muscle during a calorie deficit and supports muscle growth when in a surplus. Most lifters and athletes use this split. <em>Note: Always consult with a healthcare provider or registered dietitian before starting a fat loss diet or making significant changes to your nutrition.</em>
        </p>

        <h3 className="text-xl font-bold mt-6 mb-3">Low Carb (35% Protein, 20% Carbs, 45% Fat)</h3>
        <p>
          <strong>Best for:</strong> Low-carb dieters, insulin resistance, appetite control
        </p>
        <p>
          Prioritizes fat for energy instead of carbs. Can help with satiety and blood sugar control, but may impact high-intensity workout performance.
        </p>

        <h3 className="text-xl font-bold mt-6 mb-3">Keto (25% Protein, 5% Carbs, 70% Fat)</h3>
        <p>
          <strong>Best for:</strong> Ketogenic dieters, specific medical conditions
        </p>
        <p>
          Very low carb to induce ketosis. Requires strict tracking and isn't necessary for fat loss—it's a preference or medical strategy, not a requirement.
        </p>

        {/* Interactive Calculator */}
        <h2 className="text-2xl font-bold mt-8 mb-4">Calculate Your Macros</h2>

        <p>
          Before calculating your macros, you'll need to know your <Link to="/blog/how-to-calculate-tdee" className="text-emerald-600 dark:text-emerald-400 hover:underline">TDEE (Total Daily Energy Expenditure)</Link>. If you haven't calculated it yet, use our TDEE calculator first.
        </p>

        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 my-6 text-sm text-gray-700 dark:text-gray-300">
          <strong>Disclaimer:</strong> This calculator provides estimates for informational purposes only and should not replace professional medical advice. Macro calculations are based on general guidelines and may not be appropriate for your individual needs. Always consult a healthcare provider or registered dietitian before making significant dietary changes.
        </div>

        <MacroCalculator />

        <h2 id="how-much-protein" className="text-2xl font-bold mt-8 mb-4">How Much Protein Do You Need?</h2>
        <p>
          The most important macro to get right. <a href="https://pubmed.ncbi.nlm.nih.gov/28698222/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 dark:text-emerald-400 hover:underline">General guidelines</a>:
        </p>

        <ul className="list-disc ml-6 space-y-2 my-6">
          <li><strong>Sedentary adults:</strong> 0.6-0.8g per lb of bodyweight (or 1.2-1.6g per kg)</li>
          <li><strong>Active individuals:</strong> 0.8-1g per lb of bodyweight</li>
          <li><strong>Building muscle:</strong> 1-1.2g per lb of bodyweight</li>
          <li><strong>Fat loss + muscle preservation:</strong> 1-1.2g per lb of bodyweight</li>
        </ul>

        <div className="bg-gray-100 dark:bg-gray-800 p-5 rounded-lg my-6">
          <p className="mb-2 font-semibold">Example (180 lb person building muscle):</p>
          <ul className="space-y-1 mb-0">
            <li>Protein: 180 × 1g = <strong>180g per day</strong></li>
            <li>At 4 calories/gram = <strong>720 calories from protein</strong></li>
          </ul>
        </div>

        <p>
          <strong>Note:</strong> If you're significantly overweight, use your <em>goal weight</em> or <em>lean body mass</em> instead of current weight for protein calculations.
        </p>

        <h2 id="carbs-vs-fat" className="text-2xl font-bold mt-8 mb-4">Carbs vs Fat: What's the Right Balance?</h2>
        <p>
          Once you've set protein, the remaining calories come from carbs and fat. The split depends on:
        </p>

        <h3 className="text-xl font-bold mt-6 mb-3">Choose Higher Carbs If:</h3>
        <ul className="list-disc ml-6 space-y-2 my-6">
          <li>You do high-intensity workouts (CrossFit, HIIT, heavy lifting)</li>
          <li>You're an endurance athlete (running, cycling, swimming)</li>
          <li>You feel low energy on low-carb diets</li>
          <li>You have good insulin sensitivity</li>
        </ul>

        <h3 className="text-xl font-bold mt-6 mb-3">Choose Higher Fat If:</h3>
        <ul className="list-disc ml-6 space-y-2 my-6">
          <li>You prefer low-carb eating</li>
          <li>You do lower-intensity activity (walking, yoga, light weights)</li>
          <li>You feel fuller eating more fats</li>
        </ul>

        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 my-6 text-sm text-gray-700 dark:text-gray-300">
          <strong>Medical Conditions:</strong> If you have insulin resistance, PCOS, or other metabolic conditions, work with a healthcare provider or registered dietitian to determine the appropriate macronutrient distribution for your specific medical needs. These conditions require individualized nutritional guidance, not general recommendations.
        </div>

        <p>
          <strong>Truth:</strong> For fat loss, the carb/fat ratio matters less than total calories and protein. Choose what you enjoy and can stick to long-term.
        </p>

        <h2 id="tracking-macros" className="text-2xl font-bold mt-8 mb-4">How to Track Your Macros</h2>
        <p>
          Knowing your macro targets is step one. <strong>Tracking them consistently is step two.</strong>
        </p>

        <p>
          Free Calorie Track makes macro tracking simple:
        </p>
        <ul className="list-disc ml-6 space-y-2 my-6">
          <li>✅ Set custom macro goals (or use calculated targets)</li>
          <li>✅ See real-time progress bars for protein, carbs, and fat</li>
          <li>✅ Barcode scanning pulls accurate macro data</li>
          <li>✅ Meal categories help balance intake throughout the day</li>
          <li>✅ No premium paywall—macro tracking is free</li>
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

        <h2 id="faq" className="text-2xl font-bold mt-8 mb-4">Frequently Asked Questions</h2>

        <h3 className="text-xl font-bold mt-6 mb-3">Do I need to hit my macros exactly every day?</h3>
        <p>
          No. Aim for weekly averages, not daily perfection. If you're within 5-10g of your targets most days, you're fine.
        </p>

        <h3 className="text-xl font-bold mt-6 mb-3">What if I go over one macro but under another?</h3>
        <p>
          As long as total calories are on track, it's not a big deal occasionally. Protein is the most important to hit consistently.
        </p>

        <h3 className="text-xl font-bold mt-6 mb-3">Should I track fiber separately?</h3>
        <p>
          Fiber is a type of carbohydrate. Most trackers include it in total carbs. Aim for 25-35g fiber per day for digestive health, but it doesn't need separate tracking.
        </p>

        <h3 className="text-xl font-bold mt-6 mb-3">Can I eat anything as long as it fits my macros (IIFYM)?</h3>
        <p>
          Technically yes—you can lose weight eating junk food if calories/macros match your goals. <em>But</em> you'll feel better, perform better, and be healthier eating mostly whole foods. Use the 80/20 rule: 80% nutrient-dense foods, 20% whatever you enjoy.
        </p>

        {/* Related Posts */}
        <div className="border-t border-gray-300 dark:border-gray-700 pt-8 mt-12">
          <h3 className="text-xl font-bold mb-4">Related Articles</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <Link
              to="/blog/how-to-calculate-tdee"
              className="block p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="text-2xl mb-2">🔥</div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                How to Calculate TDEE
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-0">
                Find your Total Daily Energy Expenditure first
              </p>
            </Link>
            <Link
              to="/blog/best-blenders-for-protein-shakes"
              className="block p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="text-2xl mb-2">🫐</div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                Best Blenders for Protein Shakes
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-0">
                Hit your protein goals with daily shakes
              </p>
            </Link>
          </div>
        </div>
      </article>
    </BlogLayout>
  );
}
