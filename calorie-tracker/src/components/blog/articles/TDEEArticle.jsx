import BlogLayout from '../BlogLayout';
import SEO from '../../SEO';
import TDEECalculator from '../TDEECalculator';
import { Link } from 'react-router-dom';

export default function TDEEArticle() {
  return (
    <BlogLayout>
      <SEO
        title="How to Calculate Your TDEE (Total Daily Energy Expenditure)"
        description="Learn how to calculate your TDEE using the Mifflin-St Jeor equation and understand what it means for your calorie goals."
        keywords={['TDEE calculator', 'how to calculate TDEE', 'what is TDEE', 'total daily energy expenditure']}
        url="/blog/how-to-calculate-tdee"
        image="https://freecalorietrack.com/images/blog/tdee-calculator.webp"
        skipSiteName={true}
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
          src="/images/blog/tdee-calculator.webp"
          alt="TDEE calculator guide"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Article Header */}
      <article className="prose prose-lg dark:prose-invert max-w-none">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8"
            style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
          How to Calculate Your TDEE (Total Daily Energy Expenditure)
        </h1>

        {/* TL;DR */}
        <div className="bg-emerald-50 dark:bg-emerald-900/20 border-l-4 border-emerald-500 p-6 my-8 rounded-r-lg">
          <h3 className="text-lg font-bold text-emerald-900 dark:text-emerald-100 mt-0 mb-3">
            💡 TL;DR
          </h3>
          <ul className="mb-0 space-y-2 text-gray-800 dark:text-gray-200">
            <li><strong>TDEE (Total Daily Energy Expenditure)</strong> is the total calories your body burns per day including activity</li>
            <li><strong>BMR (Basal Metabolic Rate)</strong> is calories burned at rest (60-75% of TDEE)</li>
            <li>Use the calculator below to find your TDEE in 60 seconds</li>
            <li>Eat below TDEE to lose weight, above to gain, at TDEE to maintain</li>
          </ul>
        </div>

        {/* Interactive Calculator */}
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6 text-sm text-gray-700 dark:text-gray-300">
          <strong>Disclaimer:</strong> This calculator provides estimates for informational purposes only and should not replace professional medical advice. TDEE calculations are based on population averages and may not be accurate for your individual metabolism. Always consult a healthcare provider before making significant dietary changes.
        </div>

        <TDEECalculator />

        {/* Article Content */}
        <h2 id="what-is-tdee" className="text-2xl font-bold mt-8 mb-4">What Is TDEE?</h2>

        <p>
          <strong>TDEE (Total Daily Energy Expenditure)</strong> is the total number of <Link to="/blog/what-are-calories" className="text-emerald-600 dark:text-emerald-400 hover:underline">calories</Link> your body burns in a 24-hour period. It's not just the calories you burn exercising—it's everything your body does to keep you alive and moving throughout the day.
        </p>

        <p>
          Think of TDEE as your body's daily energy budget. Your body burns calories constantly:
        </p>

        <ul className="list-disc ml-6 space-y-2 my-6">
          <li><strong>While you sleep</strong> - Heart beats, lungs breathe, brain functions</li>
          <li><strong>While you sit at your desk</strong> - Digesting food, maintaining body temperature, cell repair</li>
          <li><strong>While you walk to the car</strong> - Every movement burns extra calories</li>
          <li><strong>While you exercise</strong> - Intentional physical activity adds even more</li>
        </ul>

        <p>
          TDEE is your <strong>maintenance calories</strong>. If you eat exactly your TDEE in calories every day, your weight stays the same. Eat less, you lose weight. Eat more, you gain weight.
        </p>

        <h2 id="components" className="text-2xl font-bold mt-8 mb-4">The Four Components of TDEE</h2>

        <p>
          Your TDEE is made up of four parts:
        </p>

        <h3 className="text-xl font-bold mt-6 mb-3">1. BMR (Basal Metabolic Rate) - 60-75% of TDEE</h3>
        <ul className="list-disc ml-6 space-y-2 my-6">
          <li><strong>What it is:</strong> Calories burned keeping you alive at complete rest</li>
          <li><strong>Includes:</strong> Breathing, circulation, cell production, nutrient processing</li>
          <li><strong>Example:</strong> A 180 lb man might have a BMR of 1,800 calories</li>
        </ul>

        <h3 className="text-xl font-bold mt-6 mb-3">2. NEAT (Non-Exercise Activity Thermogenesis) - 15-30% of TDEE</h3>
        <ul className="list-disc ml-6 space-y-2 my-6">
          <li><strong>What it is:</strong> Calories burned from daily movement that isn't formal exercise</li>
          <li><strong>Includes:</strong> Walking to your car, doing dishes, fidgeting, standing, climbing stairs</li>
          <li><strong>Varies widely:</strong> Someone with a desk job burns way less NEAT than a construction worker</li>
        </ul>

        <h3 className="text-xl font-bold mt-6 mb-3">3. TEF (Thermic Effect of Food) - 10% of TDEE</h3>
        <ul className="list-disc ml-6 space-y-2 my-6">
          <li><strong>What it is:</strong> Calories burned digesting, absorbing, and processing food</li>
          <li><strong>Protein burns the most:</strong> 20-30% of protein calories go to digestion</li>
          <li><strong>Already included:</strong> Most TDEE calculators (including ours) factor TEF into your maintenance calories automatically, so you don't need to calculate it separately</li>
        </ul>

        <h3 className="text-xl font-bold mt-6 mb-3">4. Exercise - 5-10% of TDEE (varies)</h3>
        <ul className="list-disc ml-6 space-y-2 my-6">
          <li><strong>What it is:</strong> Intentional physical activity (gym, running, sports)</li>
          <li><strong>Often overestimated:</strong> Most people think they burn more than they actually do</li>
          <li><strong>Hard to measure precisely:</strong> Exact calorie burn varies by individual, but fitness trackers and heart rate monitors provide helpful estimates for tracking trends over time</li>
        </ul>

        <h2 id="bmr-vs-tdee" className="text-2xl font-bold mt-8 mb-4">BMR vs TDEE: What's the Difference?</h2>

        <p>
          <strong>BMR</strong> is the baseline—what your body burns doing absolutely nothing. If you laid in bed all day without moving, you'd burn approximately your BMR in calories.
        </p>

        <p>
          <strong>TDEE</strong> accounts for real life. You don't lie motionless in bed—you walk, work, exercise, and move throughout the day. TDEE multiplies your BMR by an activity factor to estimate your true daily burn.
        </p>

        <div className="bg-gray-100 dark:bg-gray-800 p-5 rounded-lg my-6">
          <p className="mb-2 font-semibold">Example:</p>
          <ul className="space-y-1 mb-0">
            <li>BMR: 1,800 calories (baseline metabolism)</li>
            <li>Activity Level: Moderate (exercise 3-5x/week)</li>
            <li>TDEE: 1,800 × 1.55 = <strong>2,790 calories/day</strong></li>
          </ul>
        </div>

        <h2 id="how-to-calculate" className="text-2xl font-bold mt-8 mb-4">How to Calculate TDEE</h2>

        <p>
          The most accurate method is the <a href="https://pubmed.ncbi.nlm.nih.gov/2305711/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 dark:text-emerald-400 hover:underline">Mifflin-St Jeor equation</a>, which calculates BMR (Basal Metabolic Rate) based on age, sex, height, and weight. Then multiply BMR by your activity level.
        </p>

        <h3 className="text-xl font-bold mt-6 mb-3">Step 1: Calculate BMR</h3>

        <p><strong>For Men:</strong></p>
        <p className="bg-gray-100 dark:bg-gray-800 p-4 rounded font-mono text-sm">
          BMR = (10 × weight in kg) + (6.25 × height in cm) - (5 × age) + 5
        </p>

        <p><strong>For Women:</strong></p>
        <p className="bg-gray-100 dark:bg-gray-800 p-4 rounded font-mono text-sm">
          BMR = (10 × weight in kg) + (6.25 × height in cm) - (5 × age) - 161
        </p>

        <h3 className="text-xl font-bold mt-6 mb-3">Step 2: Multiply by Activity Factor</h3>
        <ul className="list-disc ml-6 space-y-2 my-6">
          <li><strong>Sedentary</strong> (little to no exercise): BMR × 1.2</li>
          <li><strong>Light</strong> (1-3 days/week): BMR × 1.375</li>
          <li><strong>Moderate</strong> (3-5 days/week): BMR × 1.55</li>
          <li><strong>Active</strong> (6-7 days/week): BMR × 1.725</li>
          <li><strong>Very Active</strong> (intense daily exercise): BMR × 1.9</li>
        </ul>

        <h3 className="text-xl font-bold mt-6 mb-3">How Free Calorie Track Calculates TDEE</h3>

        <p>
          Traditional TDEE calculators (including the calculator in this blog post) bake exercise into your activity level to give you a rough ballpark estimate. For example, if you select "Moderate (3-5 days/week exercise)," the calculator assumes you exercise that consistently and gives you one static TDEE number.
        </p>

        <p>
          <strong>Free Calorie Track uses a smarter approach in the app:</strong>
        </p>

        <ul className="list-disc ml-6 space-y-2 my-6">
          <li><strong>Step 1:</strong> Calculate your BMR (Basal Metabolic Rate) using your age, sex, height, and weight</li>
          <li><strong>Step 2:</strong> Apply an activity multiplier based only on your daily lifestyle—NOT including intentional exercise</li>
          <li><strong>Step 3:</strong> Add specific exercises separately when you actually log them each day</li>
        </ul>

        <p>
          <strong>Why this app approach is better:</strong> Most people don't exercise the exact same amount every day. Free Calorie Track gives you a baseline TDEE for your daily activity, then adds exercise calories only on the days you actually work out. This gives you a dynamic, accurate picture of your true daily burn instead of a static estimate.
        </p>

        <div className="bg-gray-100 dark:bg-gray-800 p-5 rounded-lg my-6">
          <p className="mb-2 font-semibold">Example:</p>
          <ul className="space-y-1 mb-0">
            <li>BMR: 1,800 calories</li>
            <li>Activity Level: Light (desk job, some walking) → 1,800 × 1.375 = 2,475 baseline TDEE</li>
            <li>Monday workout: 300 calories burned → Total TDEE: 2,775 calories</li>
            <li>Tuesday (no workout) → Total TDEE: 2,475 calories</li>
          </ul>
        </div>

        <h2 id="using-tdee" className="text-2xl font-bold mt-8 mb-4">How to Use Your TDEE</h2>

        <p>
          Once you know your TDEE, you can set your calorie goal based on what you want to achieve:
        </p>

        <div className="grid md:grid-cols-3 gap-4 my-6">
          <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-lg p-4">
            <h4 className="text-red-700 dark:text-red-400 font-bold mt-0 mb-2">Fat Loss</h4>
            <p className="text-sm mb-0">Eat <strong>200-500 below</strong> TDEE</p>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800 rounded-lg p-4">
            <h4 className="text-green-700 dark:text-green-400 font-bold mt-0 mb-2">Maintenance</h4>
            <p className="text-sm mb-0">Eat <strong>at your TDEE</strong></p>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h4 className="text-blue-700 dark:text-blue-400 font-bold mt-0 mb-2">Muscle Gain</h4>
            <p className="text-sm mb-0">Eat <strong>200-500 above</strong> TDEE</p>
          </div>
        </div>

        <h2 id="tdee-limitations" className="text-2xl font-bold mt-8 mb-4">Is TDEE 100% Accurate?</h2>

        <p>
          No. TDEE calculations are <strong>estimates</strong> based on population averages. Your actual TDEE can vary due to:
        </p>

        <ul className="list-disc ml-6 space-y-2 my-6">
          <li><strong>Genetics:</strong> Some people have faster or slower metabolisms</li>
          <li><strong>Muscle mass:</strong> Muscle burns more calories than fat (about 6 cal/lb vs 2 cal/lb)</li>
          <li><strong>Hormones:</strong> Thyroid issues, PCOS, menopause, etc. can affect metabolism</li>
          <li><strong>NEAT variation:</strong> Fidgeting and spontaneous movement vary wildly between people</li>
          <li><strong>Medication:</strong> Certain medications can increase or decrease metabolism</li>
          <li><strong>Adaptive thermogenesis:</strong> Your body adapts to prolonged calorie restriction</li>
        </ul>

        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 my-6 text-sm text-gray-700 dark:text-gray-300">
          <strong>Medical Conditions:</strong> If you have thyroid disorders, PCOS, metabolic conditions, or take medications that affect metabolism, standard TDEE calculators may not be accurate for your individual needs. Consult your healthcare provider for personalized guidance on determining your calorie requirements.
        </div>

        <h3 className="text-xl font-bold mt-6 mb-3">Solution: Adjust Based on Results</h3>

        <p>
          Use your calculated TDEE as a starting point, then adjust based on results. Track your weight for 2-3 weeks:
        </p>

        <ul className="list-disc ml-6 space-y-2 my-6">
          <li><strong>Losing faster than expected?</strong> Increase calories by 100-200</li>
          <li><strong>Not losing weight?</strong> Decrease calories by 100-200</li>
          <li><strong>Weight staying stable?</strong> You're at your true TDEE</li>
        </ul>

        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 my-6 text-sm text-gray-700 dark:text-gray-300">
          <strong>Important:</strong> Before making significant changes to your diet or calorie intake, consult with a healthcare provider or registered dietitian. This is especially important if you have any medical conditions, are taking medications, or have a history of disordered eating.
        </div>

        <h2 id="tracking-tdee" className="text-2xl font-bold mt-8 mb-4">Track Against Your TDEE with Free Calorie Track</h2>

        <p>
          Now that you know your TDEE, you need a way to track whether you're eating above, below, or at your target. Free Calorie Track calculates your TDEE automatically during setup and shows your <strong>net calories</strong>—the most important number for weight management.
        </p>

        <div className="bg-gray-100 dark:bg-gray-800 p-5 rounded-lg my-6">
          <p className="mb-2 font-semibold">Net Calories Formula:</p>
          <p className="font-mono text-sm mb-0">
            Net Calories = Food Eaten - TDEE - Exercise Burned
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 mb-0">
            A negative net means you're in a deficit (losing weight). A positive net means surplus (gaining weight).
          </p>
        </div>

        <p>
          <strong>Free Calorie Track includes:</strong>
        </p>

        <ul className="list-disc ml-6 space-y-2 my-6">
          <li>✅ Automatic TDEE calculation</li>
          <li>✅ Net calorie tracking</li>
          <li>✅ Barcode scanning for food</li>
          <li>✅ 250+ exercise database</li>
          <li>✅ Macro tracking (protein, carbs, fat)</li>
          <li>✅ Works 100% offline</li>
        </ul>

        <div className="text-center my-8">
          <Link
            to="/"
            className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-8 rounded-xl transition-colors shadow-lg"
            style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
          >
            Get Started Free
          </Link>
        </div>

        {/* Related Posts */}
        <div className="border-t border-gray-300 dark:border-gray-700 pt-8 mt-12">
          <h3 className="text-xl font-bold mb-4">Related Articles</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <Link
              to="/blog/macro-calculator-guide"
              className="block p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="text-2xl mb-2">🧮</div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                Macro Calculator Guide
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-0">
                Find your optimal protein, carbs, and fat intake
              </p>
            </Link>
            <Link
              to="/blog/best-blenders-for-protein-shakes"
              className="block p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="text-2xl mb-2">🫐</div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                NutriBullet Pro 900 Review
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-0">
                My honest review after 2 years of daily use
              </p>
            </Link>
          </div>
        </div>
      </article>
    </BlogLayout>
  );
}
